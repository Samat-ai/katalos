import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('POST /api/catalog/search', () => {
  it('rejects an invalid catalog search before querying a provider', async () => {
    const response = await POST(new Request('http://localhost/api/catalog/search', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'book', query: 'it' }),
    }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: 'Enter at least three characters.' });
  });
});
