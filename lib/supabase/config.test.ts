import { expect, it } from 'vitest';
import { getSupabaseConfig } from './config';

it('rejects incomplete Supabase configuration', () => {
  expect(() => getSupabaseConfig({})).toThrow(/NEXT_PUBLIC_SUPABASE_URL/i);
});

it('returns configured public credentials', () => {
  expect(getSupabaseConfig({ NEXT_PUBLIC_SUPABASE_URL: 'https://example.supabase.co', NEXT_PUBLIC_SUPABASE_ANON_KEY: 'anon-key' })).toEqual({ url: 'https://example.supabase.co', anonKey: 'anon-key' });
});
