import { render, screen, within } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from './page';

it('routes the hero Make your room action to the direct sign-in page', () => {
  render(<Home />);

  expect(within(screen.getByRole('banner')).getByRole('link', { name: 'MAKE YOUR ROOM' })).toHaveAttribute('href', '/signin');
});
