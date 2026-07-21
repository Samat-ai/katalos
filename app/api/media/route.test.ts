import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { POST } from './route';

describe('POST /api/media', () => {
  beforeEach(() => {
    mocks.createClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'profile-1' } } }) },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'P0001', message: 'duplicate_media_entry' } }),
          }),
        }),
      }),
    });
  });

  it('rejects a duplicate title of the same media type with a conflict response', async () => {
    const response = await POST(new Request('http://localhost/api/media', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'One Piece', type: 'manga', status: 'planned', coverUrl: '', synopsis: '', rating: '', note: '', visibility: 'public' }),
    }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: 'This title is already in your room.' });
  });
});
