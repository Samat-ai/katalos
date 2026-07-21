import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ createClient: vi.fn() }));

vi.mock('@/lib/supabase/server', () => ({ createClient: mocks.createClient }));

import { POST } from './route';

const user = { id: 'profile-1' };

function existingProfile(data: { id: string } | null) {
  return { select: vi.fn(() => ({ eq: vi.fn(() => ({ maybeSingle: vi.fn().mockResolvedValue({ data, error: null }) })) })) };
}

describe('POST /api/profile', () => {
  beforeEach(() => mocks.createClient.mockReset());

  it('requires an authenticated user', async () => {
    mocks.createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null } }) } });

    const response = await POST(new Request('http://localhost/api/profile', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ displayName: 'Momo', username: 'momo' }),
    }));

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: 'Sign in to create your room.' });
  });

  it('updates only the supplied avatar for an existing authenticated profile', async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: { username: 'momo', avatar: 'boy' }, error: null });
    const select = vi.fn(() => ({ maybeSingle }));
    const eq = vi.fn(() => ({ select }));
    const update = vi.fn(() => ({ eq }));
    const from = vi.fn().mockReturnValueOnce(existingProfile(user)).mockReturnValueOnce({ update });
    mocks.createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) }, from });

    const response = await POST(new Request('http://localhost/api/profile', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ displayName: 'Ignored', username: 'ignored', avatar: 'boy' }),
    }));

    expect(response.status).toBe(200);
    expect(update).toHaveBeenCalledWith({ avatar: 'boy' });
    expect(eq).toHaveBeenCalledWith('id', user.id);
    await expect(response.json()).resolves.toEqual({ profile: { username: 'momo', avatar: 'boy' } });
  });

  it('rejects an invalid avatar before attempting an existing-profile update', async () => {
    const update = vi.fn();
    const from = vi.fn().mockReturnValueOnce(existingProfile(user)).mockReturnValueOnce({ update });
    mocks.createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) }, from });

    const response = await POST(new Request('http://localhost/api/profile', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ avatar: 'robot' }),
    }));

    expect(response.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it('returns a validated default avatar after profile creation', async () => {
    const single = vi.fn().mockResolvedValue({ data: { username: 'momo', avatar: 'girl' }, error: null });
    const insert = vi.fn(() => ({ select: vi.fn(() => ({ single })) }));
    const from = vi.fn().mockReturnValueOnce(existingProfile(null)).mockReturnValueOnce({ insert });
    mocks.createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) }, from });

    const response = await POST(new Request('http://localhost/api/profile', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ displayName: 'Momo', username: 'momo' }),
    }));

    expect(response.status).toBe(201);
    expect(insert).toHaveBeenCalledWith({ id: user.id, username: 'momo', display_name: 'Momo', avatar: 'girl' });
    await expect(response.json()).resolves.toEqual({ profile: { username: 'momo', avatar: 'girl' } });
  });

  it('preserves the username conflict response', async () => {
    const single = vi.fn().mockResolvedValue({ data: null, error: { code: '23505' } });
    const from = vi.fn().mockReturnValueOnce(existingProfile(null)).mockReturnValueOnce({ insert: vi.fn(() => ({ select: vi.fn(() => ({ single })) })) });
    mocks.createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) }, from });

    const response = await POST(new Request('http://localhost/api/profile', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ displayName: 'Momo', username: 'momo' }),
    }));

    expect(response.status).toBe(409);
    await expect(response.json()).resolves.toEqual({ error: 'That username is already taken.' });
  });

  it('rejects an insertion response with an invalid avatar', async () => {
    const single = vi.fn().mockResolvedValue({ data: { username: 'momo', avatar: 'robot' }, error: null });
    const from = vi.fn().mockReturnValueOnce(existingProfile(null)).mockReturnValueOnce({ insert: vi.fn(() => ({ select: vi.fn(() => ({ single })) })) });
    mocks.createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user } }) }, from });

    const response = await POST(new Request('http://localhost/api/profile', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ displayName: 'Momo', username: 'momo' }),
    }));

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ error: 'We could not validate your profile. Please retry.' });
  });
});
