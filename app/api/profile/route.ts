import { NextResponse } from 'next/server';
import { OnboardingSchema } from '@/lib/auth/schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const parsed = OnboardingSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Invalid profile.' }, { status: 400 });
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to create your room.' }, { status: 401 });
  const { data, error } = await supabase.from('profiles').insert({ id: user.id, username: parsed.data.username, display_name: parsed.data.displayName }).select('username').single();
  if (error?.code === '23505') return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 });
  if (error) return NextResponse.json({ error: 'We could not save your profile. Please retry.' }, { status: 500 });
  return NextResponse.json({ profile: data }, { status: 201 });
}
