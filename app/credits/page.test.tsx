import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import CreditsPage from './page';

it('includes required catalog-provider attribution', () => {
  render(<CreditsPage />);
  expect(screen.getByRole('heading', { name: /credits/i })).toBeVisible();
  expect(screen.getByText(/not endorsed or certified by tmdb/i)).toBeVisible();
  expect(screen.getByText(/not affiliated with myanimelist/i)).toBeVisible();
  expect(screen.getByRole('link', { name: /open library/i })).toHaveAttribute('href', 'https://openlibrary.org/');
  expect(screen.getByRole('img', { name: /tmdb/i })).toHaveAttribute('src', expect.stringContaining('themoviedb.org/assets'));
});
