import { z } from 'zod';
import { NextResponse } from 'next/server';
import { publicEntriesForProfiler, type MediaRow } from '@/lib/media/serialization';
import { createClient } from '@/lib/supabase/server';
import { getTasteProfilerConfig, requestTasteProfile } from '@/lib/taste/profiler';

const RequestSchema = z.object({ username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,32}$/) });
const fields = 'id, title, type, status, cover_url, synopsis, rating, note, visibility';

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'A valid username is required.' }, { status: 400 });

  try {
    const supabase = await createClient();
    const { data: profile } = await supabase.from('profiles').select('id').eq('username', parsed.data.username).maybeSingle();
    if (!profile) return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    const { data, error } = await supabase.from('media_entries').select(fields).eq('profile_id', profile.id).eq('visibility', 'public');
    if (error) throw error;
    if (!data?.length) return NextResponse.json({ error: 'This room has no public media yet.' }, { status: 422 });
    const profileResult = await requestTasteProfile(publicEntriesForProfiler(data as MediaRow[]), getTasteProfilerConfig());
    return NextResponse.json({ profile: profileResult });
  } catch {
    return NextResponse.json({ error: 'The profiler is taking a tea break. Please retry.' }, { status: 502 });
  }
}
