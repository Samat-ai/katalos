import { z } from 'zod';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const MagicLinkSchema = z.object({ email: z.string().trim().email('Enter a valid email address.') });

export async function POST(request: Request) {
  const parsed = MagicLinkSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Enter a valid email address.' }, { status: 400 });

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: { emailRedirectTo: new URL('/auth/callback?next=/room', request.url).toString() },
  });
  if (error) return NextResponse.json({ error: 'We could not send that link. Please retry.' }, { status: 502 });
  return NextResponse.json({ ok: true });
}
