import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { CoverBlock } from './CoverBlock';
import { PixelTooltip } from './PixelTooltip';

afterEach(cleanup);

it('replaces a failed cover image with title initials', () => {
  render(<CoverBlock title="Spirited Away" coverUrl="https://example.test/missing.png" />);

  fireEvent.error(screen.getByRole('img', { name: 'Spirited Away' }));

  expect(screen.queryByRole('img', { name: 'Spirited Away' })).not.toBeInTheDocument();
  expect(screen.getByText('SA')).toBeVisible();
});

it('exposes its focus-visible label in a themed tooltip', () => {
  render(<PixelTooltip label="Spirited Away · movie" anchorRect={{ left: 100, top: 80, width: 30, height: 88 }} />);

  const tooltip = screen.getByRole('tooltip');
  expect(tooltip).toHaveTextContent('Spirited Away · movie');
  expect(tooltip).not.toHaveAttribute('title');
  expect(tooltip).toHaveStyle({ left: '115px', top: '80px' });
});
