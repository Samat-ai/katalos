import { notFound } from 'next/navigation';
import { HandoffFrame } from '@/components/handoff/HandoffFrame';
import { PublicRoomActions } from '@/components/room/PublicRoomActions';
import { TasteProfilerCard } from '@/components/room/TasteProfilerCard';
import { toHandoffShelves } from '@/lib/handoff/entries';
import { toMediaEntry, type MediaRow } from '@/lib/media/serialization';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase.from('profiles').select('id, username, display_name, avatar').eq('username', username).maybeSingle();
  if (!profile) notFound();
  const { data } = await supabase.from('media_entries').select('id, title, type, status, cover_url, synopsis, rating, note, visibility').eq('profile_id', profile.id).eq('visibility', 'public').order('created_at', { ascending: false });
  const entries = ((data ?? []) as MediaRow[]).map(toMediaEntry);
  return <main className="public-room"><div className="handoff-public-room"><HandoffFrame src="/handoff/landing.dc.html" title={`${profile.display_name}'s room`} shelves={toHandoffShelves(entries)} /><div className="handoff-public-actions"><span>@{profile.username}</span><PublicRoomActions username={profile.username} /></div></div>{entries.length ? <TasteProfilerCard username={profile.username} displayName={profile.display_name} publicCount={entries.length} /> : <section className="public-empty" aria-labelledby="public-empty-title"><h2 id="public-empty-title">THE PUBLIC SHELVES ARE EMPTY</h2><p>{profile.display_name} hasn&apos;t shared any media here yet.</p></section>}</main>;
}
