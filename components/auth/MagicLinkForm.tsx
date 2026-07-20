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
      setMessage('Link sent! It works once and expires in 15 minutes.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'We could not send that link. Please retry.');
    } finally {
      setSending(false);
    }
  }

  return <form className="magic-link-form" onSubmit={submit} noValidate>
    <label htmlFor="email">EMAIL ADDRESS</label>
    <div className="magic-link-controls"><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@somewhere.com" required /><button disabled={sending} type="submit">{sending ? 'SENDING…' : 'SEND LINK'}</button></div>
    {message && <p role="status">{message}</p>}
  </form>;
}
