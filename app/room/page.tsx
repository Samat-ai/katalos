import { redirect } from 'next/navigation';
import { OwnerRoomClient } from './OwnerRoomClient';
import { SiteNav } from '@/components/ui/SiteNav';
import { toMediaEntry, type MediaRow } from '@/lib/media/serialization';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function OwnerRoomPage({ searchParams }: { searchParams: Promise<{ add?: string | string[] }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');
  const { data: profile } = await supabase.from('profiles').select('username, display_name, avatar').eq('id', user.id).maybeSingle();
  if (!profile) redirect('/onboarding');
  const { data, error } = await supabase.from('media_entries').select('id, title, type, status, cover_url, synopsis, rating, note, visibility').eq('profile_id', user.id).order('created_at', { ascending: false });
  if (error) throw new Error('Unable to load your room.');
  return <main className="owner-page app-stage"><SiteNav actionHref="/" actionLabel="BACK HOME" /><OwnerRoomClient initialEntries={((data ?? []) as MediaRow[]).map(toMediaEntry)} displayName={profile.display_name} username={profile.username} avatar={profile.avatar === 'boy' ? 'boy' : 'girl'} initialAdd={params.add === '1'} /></main>;
}
