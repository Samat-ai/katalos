import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MediaCover } from './MediaCover';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it('renders supplied cover art with the media title as alt text', () => {
  render(<MediaCover index={0} onSelect={vi.fn()} entry={{ id: 'dune', title: 'Dune', type: 'book', status: 'finished', synopsis: '', coverUrl: 'https://example.com/dune.jpg', visibility: 'public' }} />);
  expect(screen.getByRole('img', { name: 'Dune' })).toHaveAttribute('src', 'https://example.com/dune.jpg');
});

it('shows a PixelTooltip when its cover receives keyboard focus', () => {
  render(<MediaCover index={0} onSelect={vi.fn()} entry={{ id: 'dune', title: 'Dune', type: 'book', status: 'finished', synopsis: '', visibility: 'public' }} />);
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({ left: 20, top: 30, width: 40 } as DOMRect);

  fireEvent.focus(screen.getByRole('button', { name: 'Open Dune' }));

  expect(screen.getByRole('tooltip')).toHaveTextContent('Dune · book');
  expect(screen.getByRole('tooltip')).toHaveStyle({ left: '40px', top: '30px' });
});
