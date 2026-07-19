import { describe, expect, it } from 'vitest';
import { POST } from './route';

describe('POST /api/catalog/details', () => {
  it('rejects candidates missing a provider id', async () => {
    const response = await POST(new Request('http://localhost/api/catalog/details', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ type: 'book', source: 'open_library', title: 'Dune' }) }));
    expect(response.status).toBe(400);
  });
});
