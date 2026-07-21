import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { MagicLinkForm } from './MagicLinkForm';

beforeEach(() => vi.unstubAllGlobals());
afterEach(cleanup);

it('shows idle, sending, and sent labels while a magic link is requested', async () => {
  let resolveRequest: (value: { ok: boolean; json: () => Promise<{ ok: boolean }> }) => void;
  const pendingRequest = new Promise<{ ok: boolean; json: () => Promise<{ ok: boolean }> }>((resolve) => { resolveRequest = resolve; });
  vi.stubGlobal('fetch', vi.fn().mockReturnValue(pendingRequest));
  render(<MagicLinkForm />);

  expect(screen.getByRole('button', { name: 'SEND LINK' })).toBeEnabled();
  fireEvent.change(screen.getByLabelText('EMAIL ADDRESS'), { target: { value: 'momo@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'SEND LINK' }));
  expect(screen.getByRole('button', { name: 'SENDING…' })).toBeDisabled();

  resolveRequest!({ ok: true, json: async () => ({ ok: true }) });
  await screen.findByText('Link sent! It works once and expires in 15 minutes.');
});

it('shows an error label when the magic-link request fails', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'Unable to send link.' }) }));
  render(<MagicLinkForm />);

  fireEvent.change(screen.getByLabelText('EMAIL ADDRESS'), { target: { value: 'momo@example.com' } });
  fireEvent.click(screen.getByRole('button', { name: 'SEND LINK' }));

  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('Unable to send link.'));
});
