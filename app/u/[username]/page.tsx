import { notFound } from 'next/navigation';
import { MediaRoom } from '@/components/room/MediaRoom';
import { TasteProfilerCard } from '@/components/room/TasteProfilerCard';
import type { MediaEntry } from '@/lib/media/types';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('id, username, display_name').eq('username', username).maybeSingle();
  if (!profile) notFound();
  const { data } = await supabase.from('media_entries').select('id, title, type, status, cover_url, synopsis, rating, note, visibility').eq('profile_id', profile.id).eq('visibility', 'public').order('created_at', { ascending: false });
  const entries: MediaEntry[] = (data ?? []).map((entry) => ({ id: entry.id, title: entry.title, type: entry.type as MediaEntry['type'], status: entry.status as MediaEntry['status'], coverUrl: entry.cover_url ?? undefined, synopsis: entry.synopsis, rating: entry.rating ?? undefined, note: entry.note ?? undefined, visibility: 'public' }));
  return <main className="owner-page"><header><p className="eyebrow">@{profile.username}</p><h1>{profile.display_name}&apos;s room</h1></header>{entries.length ? <><MediaRoom entries={entries} readOnly /><TasteProfilerCard username={profile.username} /></> : <p>This room has no shared media yet.</p>}</main>;
}
