import { NextResponse } from 'next/server';
import { AvatarSchema, OnboardingSchema, ProfileResponseSchema } from '@/lib/auth/schema';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const onboarding = OnboardingSchema.safeParse(body);
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Sign in to create your room.' }, { status: 401 });

  const { data: existing, error: existingError } = await supabase.from('profiles').select('id').eq('id', user.id).maybeSingle();
  if (existingError) return NextResponse.json({ error: 'We could not load your profile. Please retry.' }, { status: 500 });

  if (existing) {
    const avatar = AvatarSchema.safeParse(body && typeof body === 'object' ? body.avatar : undefined);
    if (!avatar.success) return NextResponse.json({ error: avatar.error.issues[0]?.message ?? 'Choose a valid avatar.' }, { status: 400 });
    const { data, error } = await supabase.from('profiles').update({ avatar: avatar.data }).eq('id', user.id).select('username, avatar').maybeSingle();
    if (error || !data) return NextResponse.json({ error: 'We could not save your avatar. Please retry.' }, { status: 500 });
    const profile = ProfileResponseSchema.safeParse(data);
    if (!profile.success) return NextResponse.json({ error: 'We could not validate your profile. Please retry.' }, { status: 500 });
    return NextResponse.json({ profile: profile.data });
  }

  if (!onboarding.success) return NextResponse.json({ error: onboarding.error.issues[0]?.message ?? 'Invalid profile.' }, { status: 400 });
  const { data, error } = await supabase.from('profiles').insert({ id: user.id, username: onboarding.data.username, display_name: onboarding.data.displayName, avatar: onboarding.data.avatar }).select('username, avatar').single();
  if (error?.code === '23505') return NextResponse.json({ error: 'That username is already taken.' }, { status: 409 });
  if (error) return NextResponse.json({ error: 'We could not save your profile. Please retry.' }, { status: 500 });
  const profile = ProfileResponseSchema.safeParse(data);
  if (!profile.success) return NextResponse.json({ error: 'We could not validate your profile. Please retry.' }, { status: 500 });
  return NextResponse.json({ profile: profile.data }, { status: 201 });
}
