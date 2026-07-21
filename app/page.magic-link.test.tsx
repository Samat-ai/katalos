import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';

vi.mock('@/components/handoff/HandoffFrame', () => ({
  HandoffFrame: ({ onMagicLink }: { onMagicLink?: (email: string) => Promise<unknown> }) => <button type="button" onClick={() => void onMagicLink?.('momo@example.com')}>SEND HANDOFF LINK</button>,
}));

import Home from './page';

afterEach(() => vi.unstubAllGlobals());

it('submits landing magic links through the real auth endpoint', async () => {
  const user = userEvent.setup();
  const fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ ok: true })));
  vi.stubGlobal('fetch', fetch);
  render(<Home />);

  await user.click(screen.getByRole('button', { name: 'SEND HANDOFF LINK' }));

  await waitFor(() => expect(fetch).toHaveBeenCalledWith('/api/auth/magic-link', expect.objectContaining({ method: 'POST', body: JSON.stringify({ email: 'momo@example.com' }) })));
});
