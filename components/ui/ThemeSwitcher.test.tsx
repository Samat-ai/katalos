import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { getClockTheme, ThemeManager, ThemeSwitcher } from './ThemeSwitcher';

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

it('persists a manually selected room theme', async () => {
  const user = userEvent.setup();
  render(<ThemeSwitcher />);

  await user.click(screen.getByRole('button', { name: /night theme/i }));

  expect(document.documentElement.dataset.ktheme).toBe('night');
  expect(window.localStorage.getItem('katalos_theme')).toBe('night');
});

it.each([
  [5, 'morning'],
  [12, 'afternoon'],
  [19, 'night'],
] as const)('selects the correct clock theme at %i:00', (hour, expectedTheme) => {
  expect(getClockTheme(hour)).toBe(expectedTheme);
});

it('uses a saved theme instead of the clock theme', () => {
  window.localStorage.setItem('katalos_theme', 'night');

  render(<ThemeManager />);

  expect(document.documentElement.dataset.ktheme).toBe('night');
});
