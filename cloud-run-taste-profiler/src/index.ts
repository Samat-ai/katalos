import express from 'express';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';

const EntrySchema = z.object({
  title: z.string().trim().min(1).max(160),
  type: z.enum(['book', 'manga', 'anime', 'movie']),
  status: z.enum(['planned', 'in_progress', 'finished', 'abandoned']),
  synopsis: z.string().max(1_000),
  rating: z.number().int().min(1).max(5).optional(),
});
const InputSchema = z.object({ entries: z.array(EntrySchema).min(1).max(100) });
const ProfileSchema = z.object({
  archetype: z.string().min(1),
  profile: z.string().min(1),
  signals: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]),
  firstPick: z.object({ title: z.string().min(1), reason: z.string().min(1) }),
});

const sharedToken = process.env.TASTE_PROFILER_SHARED_TOKEN;
if (!sharedToken) throw new Error('TASTE_PROFILER_SHARED_TOKEN is required.');

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION ?? 'us-central1',
});
const responseJsonSchema = {
  type: 'object',
  properties: {
    archetype: { type: 'string' }, profile: { type: 'string' },
    signals: { type: 'array', items: { type: 'string' }, minItems: 3, maxItems: 3 },
    firstPick: { type: 'object', properties: { title: { type: 'string' }, reason: { type: 'string' } }, required: ['title', 'reason'] },
  },
  required: ['archetype', 'profile', 'signals', 'firstPick'],
};

const app = express();
app.use(express.json({ limit: '128kb' }));

app.post('/', async (request, response) => {
  if (request.header('authorization') !== `Bearer ${sharedToken}`) return response.status(401).json({ error: 'Unauthorized.' });
  const parsed = InputSchema.safeParse(request.body);
  if (!parsed.success) return response.status(400).json({ error: 'Invalid profiler input.' });
  try {
    const generated = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL ?? 'gemini-2.5-flash',
      contents: `Create a Katalos Taste Profile from only these public media entries. Keep every statement spoiler-safe. Do not infer demographics, health, religion, politics, sexuality, or any other sensitive traits. Be warm and lightly funny. firstPick.title must exactly match a supplied title. Entries:\n${JSON.stringify(parsed.data.entries)}`,
      config: { responseMimeType: 'application/json', responseJsonSchema },
    });
    const profile = ProfileSchema.parse(JSON.parse(generated.text ?? '{}'));
    if (!parsed.data.entries.some((entry) => entry.title === profile.firstPick.title)) throw new Error('Invalid first pick.');
    return response.json({ profile });
  } catch {
    return response.status(502).json({ error: 'Taste profile generation failed.' });
  }
});

app.listen(Number(process.env.PORT ?? 8080));
