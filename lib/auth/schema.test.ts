import { expect, it } from 'vitest';
import { OnboardingSchema } from './schema';

it('normalizes a valid public profile handle to lowercase', () => {
  expect(OnboardingSchema.parse({ displayName: 'Miyu', username: 'Miyu_Room' })).toEqual({
    displayName: 'Miyu',
    username: 'miyu_room',
    avatar: 'girl',
  });
});

it('rejects a public profile handle outside the allowed format', () => {
  expect(() => OnboardingSchema.parse({ displayName: 'Miyu', username: 'not a handle' })).toThrow(/username/i);
});

it('keeps the selected room avatar', () => {
  expect(OnboardingSchema.parse({ displayName: 'Miyu', username: 'miyu_room', avatar: 'boy' }).avatar).toBe('boy');
});

it('accepts lowercase public profile handles with dashes', () => {
  expect(OnboardingSchema.parse({ displayName: 'Miyu', username: 'miyu-room' }).username).toBe('miyu-room');
});
