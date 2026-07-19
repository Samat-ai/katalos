import { z } from 'zod';
import type { ProfilerEntry } from '@/lib/media/serialization';
import { TasteProfileSchema, type TasteProfile } from './schema';

const ProfilerResponseSchema = z.object({ profile: TasteProfileSchema });

export type TasteProfilerConfig = {
  url: string;
  token: string;
  fetcher?: typeof fetch;
};

export function getTasteProfilerConfig(environment: Record<string, string | undefined> = process.env): TasteProfilerConfig {
  const url = environment.TASTE_PROFILER_URL;
  const token = environment.TASTE_PROFILER_SHARED_TOKEN;
  if (!url) throw new Error('Taste Profiler is not configured: set TASTE_PROFILER_URL.');
  if (!token) throw new Error('Taste Profiler is not configured: set TASTE_PROFILER_SHARED_TOKEN.');
  return { url, token };
}

export async function requestTasteProfile(entries: ProfilerEntry[], config: TasteProfilerConfig): Promise<TasteProfile> {
  const response = await (config.fetcher ?? fetch)(new URL('/', config.url).toString(), {
    method: 'POST',
    headers: {
      authorization: `Bearer ${config.token}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ entries }),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error('Taste Profiler request failed.');
  const { profile } = ProfilerResponseSchema.parse(await response.json());
  if (!entries.some((entry) => entry.title === profile.firstPick.title)) {
    throw new Error('Taste Profiler returned a first pick outside this room.');
  }
  return profile;
}
