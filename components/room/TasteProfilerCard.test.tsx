import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { TasteProfilerCard } from './TasteProfilerCard';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it('invites a public visitor to read the room owner’s taste', () => {
  render(<TasteProfilerCard username="momo" displayName="Momo" publicCount={3} />);

  expect(screen.getByRole('button', { name: "READ MOMO'S TASTE" })).toBeVisible();
});

it('explains when a public room needs more shared picks', () => {
  render(<TasteProfilerCard username="momo" displayName="Momo" publicCount={2} />);

  expect(screen.getByText('MOMO NEEDS 3 PUBLIC PICKS')).toBeVisible();
  expect(screen.queryByRole('button', { name: /read momo/i })).not.toBeInTheDocument();
});

it('shows three stepping squares while reading a taste profile', async () => {
  const user = userEvent.setup();
  let resolveProfile: (value: Response) => void = () => {};
  vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>((resolve) => { resolveProfile = resolve; })));
  render(<TasteProfilerCard username="momo" displayName="Momo" publicCount={3} />);

  await user.click(screen.getByRole('button', { name: "READ MOMO'S TASTE" }));

  expect(screen.getByRole('status', { name: /consulting momo's shelves/i })).toBeVisible();
  expect(screen.getAllByTestId('profiler-step')).toHaveLength(3);

  resolveProfile(new Response(JSON.stringify({ profile: { archetype: 'Cozy', profile: 'Warm.', signals: [], firstPick: { title: 'Book', reason: 'Because.' } } }), { status: 200 }));
});

it('keeps a retry action after the profiler is unavailable', async () => {
  const user = userEvent.setup();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: 'The profiler is taking a tea break. Please retry.' }), { status: 502 })));
  render(<TasteProfilerCard username="momo" displayName="Momo" publicCount={3} />);

  await user.click(screen.getByRole('button', { name: "READ MOMO'S TASTE" }));

  expect(await screen.findByRole('alert')).toHaveTextContent('The profiler is taking a tea break. Please retry.');
  expect(screen.getByRole('button', { name: 'TRY AGAIN' })).toBeVisible();
});
