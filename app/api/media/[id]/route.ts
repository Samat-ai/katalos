import { NextResponse } from 'next/server';
import { MediaEntryInputSchema, mediaInputToRow } from '@/lib/media/schema';
import { toMediaEntry } from '@/lib/media/serialization';
import { createClient } from '@/lib/supabase/server';

const fields = 'id, title, type, status, cover_url, synopsis, rating, note, visibility';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const parsed = MediaEntryInputSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid media entry.' }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to edit your room.' }, { status: 401 });
  const { id } = await params;
  const { data, error } = await supabase.from('media_entries').update(mediaInputToRow(parsed.data)).eq('id', id).eq('profile_id', user.id).select(fields).maybeSingle();
  if (error || !data) return NextResponse.json({ error: 'That media entry could not be found.' }, { status: 404 });
  return NextResponse.json({ entry: toMediaEntry(data) });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to edit your room.' }, { status: 401 });
  const { id } = await params;
  const { error } = await supabase.from('media_entries').delete().eq('id', id).eq('profile_id', user.id);
  if (error) return NextResponse.json({ error: 'That media entry could not be deleted.' }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
