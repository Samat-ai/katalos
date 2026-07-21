import { redirect } from 'next/navigation';
import { OnboardingForm } from '@/components/auth/OnboardingForm';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
  if (profile) redirect('/room');
  return <main className="handoff-auth-page"><nav className="handoff-topbar"><a className="handoff-wordmark" href="/">KATALOS</a></nav><section className="handoff-onboarding-shell"><OnboardingForm /></section></main>;
}
