import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { MediaCover } from './MediaCover';

it('renders supplied cover art with the media title as alt text', () => {
  render(<MediaCover index={0} onSelect={vi.fn()} entry={{ id: 'dune', title: 'Dune', type: 'book', status: 'finished', synopsis: '', coverUrl: 'https://example.com/dune.jpg', visibility: 'public' }} />);
  expect(screen.getByRole('img', { name: 'Dune' })).toHaveAttribute('src', 'https://example.com/dune.jpg');
});
