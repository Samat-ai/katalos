import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import SignInPage from './page';

it('renders a direct magic-link sign-in page', () => {
  render(<SignInPage />);

  expect(screen.getByRole('heading', { name: /sign in to your room/i })).toBeVisible();
  expect(screen.getByLabelText('EMAIL')).toBeVisible();
  expect(screen.getByRole('link', { name: 'BACK HOME' })).toHaveAttribute('href', '/');
});
