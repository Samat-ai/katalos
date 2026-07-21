import { NextResponse } from 'next/server';
import { MediaEntryInputSchema, mediaInputToRow } from '@/lib/media/schema';
import { toMediaEntry } from '@/lib/media/serialization';
import { createClient } from '@/lib/supabase/server';

const fields = 'id, title, type, status, cover_url, synopsis, rating, note, visibility';

export async function POST(request: Request) {
  const parsed = MediaEntryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid media entry.' }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to edit your room.' }, { status: 401 });
  const { data, error } = await supabase.from('media_entries').insert({ ...mediaInputToRow(parsed.data), profile_id: user.id }).select(fields).single();
  if (error?.code === 'P0001' && error.message === 'duplicate_media_entry') return NextResponse.json({ error: 'This title is already in your room.' }, { status: 409 });
  if (error) return NextResponse.json({ error: 'We could not save that entry. Please retry.' }, { status: 500 });
  return NextResponse.json({ entry: toMediaEntry(data) }, { status: 201 });
}
