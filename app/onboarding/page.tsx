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
  return <main className="owner-page"><header><div><p className="eyebrow">Welcome to Katalos</p><h1>Set up your room.</h1><p>Choose the name visitors will see and your public handle.</p></div></header><OnboardingForm /></main>;
}
