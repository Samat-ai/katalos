import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';

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
