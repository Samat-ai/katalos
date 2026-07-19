'use client';

import { useState } from 'react';

export function MagicLinkForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setMessage('');
    try {
      const response = await fetch('/api/auth/magic-link', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setMessage('Check your email for your Katalos sign-in link.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not send that link. Please retry.');
    } finally {
      setSending(false);
    }
  }

  return <form className="magic-link-form" onSubmit={submit} noValidate>
    <label htmlFor="email">Email</label>
    <input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required />
    <button disabled={sending} type="submit">{sending ? 'Sending link…' : 'Email me a sign-in link'}</button>
    {message && <p role="status">{message}</p>}
  </form>;
}
