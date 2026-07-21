import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import CreditsPage from './page';

afterEach(cleanup);

it('includes required catalog-provider attribution', () => {
  render(<CreditsPage />);
  expect(screen.getByRole('heading', { name: /credits/i })).toBeVisible();
  expect(screen.getByText('This product uses the TMDB API but is not endorsed or certified by TMDB.')).toBeVisible();
  expect(screen.getByText('Jikan is not affiliated with MyAnimeList.net.')).toBeVisible();
  expect(screen.getByRole('link', { name: /open library/i })).toHaveAttribute('href', 'https://openlibrary.org/');
  const aniList = screen.getByRole('link', { name: /anilist/i });
  expect(aniList).toHaveAttribute('href', 'https://anilist.co/');
  expect(aniList.parentElement).toHaveTextContent('AniList as an outage fallback.');
  expect(screen.getByRole('img', { name: /tmdb/i })).toHaveAttribute('src', expect.stringContaining('themoviedb.org/assets'));
});

it('keeps catalog credits inside the shared handoff page shell', () => {
  const { container } = render(<CreditsPage />);

  expect(container.querySelector('.app-stage')).not.toBeNull();
  expect(container.querySelector('.credits-stack')).not.toBeNull();
  expect(screen.getByRole('link', { name: /back home/i })).toHaveAttribute('href', '/');
});
