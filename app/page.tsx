'use client';

import { HandoffFrame, type MagicLinkResult } from '@/components/handoff/HandoffFrame';

export default function Home() {
  function scrollToMagicLink() {
    document.getElementById('sign-in')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function sendMagicLink(email: string): Promise<MagicLinkResult> {
    try {
      const response = await fetch('/api/auth/magic-link', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
      const body = await response.json().catch(() => null) as { error?: string } | null;
      if (!response.ok) return { kind: 'error', message: body?.error ?? 'We could not send that link. Please retry.' };
      return { kind: 'sent', message: 'Link sent! It works once and expires in 15 minutes.' };
    } catch {
      return { kind: 'error', message: 'We could not send that link. Please retry.' };
    }
  }

  return <HandoffFrame src="/handoff/landing.dc.html" title="Katalos landing" onMakeRoom={scrollToMagicLink} onMagicLink={sendMagicLink} />;
}
