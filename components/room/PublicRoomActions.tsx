'use client';

import { useState } from 'react';

export function PublicRoomActions({ username }: { username: string }) {
  const [message, setMessage] = useState('COPY ROOM LINK');

  async function copy() {
    try {
      const publicRoomUrl = new URL(`/u/${username}`, window.location.origin).toString();
      await navigator.clipboard.writeText(publicRoomUrl);
      setMessage('✓ COPIED');
      window.setTimeout(() => setMessage('COPY ROOM LINK'), 2_000);
    } catch { setMessage('LONG-PRESS URL'); }
  }

  return <button className="public-share" type="button" onClick={() => void copy()}>{message}</button>;
}
