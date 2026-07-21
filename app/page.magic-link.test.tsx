import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import Home from './page';

it('routes landing magic-link calls through the direct sign-in page', () => {
  render(<Home />);

  for (const link of screen.getAllByRole('link', { name: 'MAKE YOUR ROOM' })) {
    expect(link).toHaveAttribute('href', '/signin');
  }
});
