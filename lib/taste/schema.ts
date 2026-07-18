import { z } from 'zod';
export const TasteProfileSchema = z.object({ archetype: z.string().min(1), profile: z.string().min(1), signals: z.tuple([z.string().min(1), z.string().min(1), z.string().min(1)]), firstPick: z.object({ title: z.string().min(1), reason: z.string().min(1) }) });
export type TasteProfile = z.infer<typeof TasteProfileSchema>;
