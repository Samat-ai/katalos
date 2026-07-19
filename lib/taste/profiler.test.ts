import { expect, it, vi } from 'vitest';
import { requestTasteProfile } from './profiler';

const entries = [{ title: 'Spirited Away', type: 'movie' as const, status: 'finished' as const, synopsis: 'A beloved fantasy.', rating: 5 }];

it('posts validated public entries to Cloud Run with the server token', async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
    profile: {
      archetype: 'The Wonder Chaser',
      profile: 'You seek kind strange worlds.',
      signals: ['You choose wonder.', 'You love heart.', 'You rewatch warmth.'],
      firstPick: { title: 'Spirited Away', reason: 'It is already in your room.' },
    },
  }), { status: 200 }));

  await expect(requestTasteProfile(entries, {
    url: 'https://profiler.example.run.app',
    token: 'shared-secret',
    fetcher,
  })).resolves.toMatchObject({ archetype: 'The Wonder Chaser' });

  expect(fetcher).toHaveBeenCalledWith('https://profiler.example.run.app/', expect.objectContaining({
    method: 'POST',
    headers: expect.objectContaining({ authorization: 'Bearer shared-secret' }),
  }));
});

it('rejects a profiler response whose first pick is not in the supplied room', async () => {
  const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
    profile: {
      archetype: 'The Wonder Chaser',
      profile: 'You seek kind strange worlds.',
      signals: ['One', 'Two', 'Three'],
      firstPick: { title: 'Elsewhere', reason: 'Nope.' },
    },
  }), { status: 200 }));

  await expect(requestTasteProfile(entries, { url: 'https://profiler.example.run.app', token: 'shared-secret', fetcher })).rejects.toThrow(/first pick/i);
});
