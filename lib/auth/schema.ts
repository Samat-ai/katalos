import { z } from 'zod';

export const OnboardingSchema = z.object({
  displayName: z.string().trim().min(1, 'Display name is required').max(80),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,32}$/, 'Username must use 3–32 lowercase letters, numbers, or underscores.'),
  avatar: z.enum(['girl', 'boy']).optional(),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
