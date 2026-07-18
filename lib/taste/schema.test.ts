import { expect, it } from 'vitest';
import { TasteProfileSchema } from './schema';

it('accepts a complete three-signal taste profile', () => {
  expect(TasteProfileSchema.parse({ archetype: 'The Hopeful Worldbuilder', profile: 'You collect warm, strange worlds.', signals: ['You favor wonder.', 'You return to courage.', 'You forgive a little melancholy.'], firstPick: { title: 'Spirited Away', reason: 'It matches your sense of wonder.' } })).toBeDefined();
});
