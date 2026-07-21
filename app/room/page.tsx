import { redirect } from 'next/navigation';
import { OwnerRoomClient } from './OwnerRoomClient';
import { toMediaEntry, type MediaRow } from '@/lib/media/serialization';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function OwnerRoomPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');
  const { data: profile } = await supabase.from('profiles').select('username, avatar').eq('id', user.id).maybeSingle();
  if (!profile) redirect('/onboarding');
  const { data, error } = await supabase.from('media_entries').select('id, title, type, status, cover_url, synopsis, rating, note, visibility').eq('profile_id', user.id).order('created_at', { ascending: false });
  if (error) throw new Error('Unable to load your room.');
  return <main className="owner-page"><OwnerRoomClient initialEntries={((data ?? []) as MediaRow[]).map(toMediaEntry)} username={profile.username} avatar={profile.avatar === 'boy' ? 'boy' : 'girl'} /></main>;
}
