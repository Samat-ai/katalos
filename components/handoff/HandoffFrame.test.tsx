import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { HandoffFrame } from './HandoffFrame';

it('mounts the supplied landing document without rewriting it', () => {
  render(<HandoffFrame src="/handoff/landing.dc.html" title="Katalos landing" />);
  expect(screen.getByTitle('Katalos landing')).toHaveAttribute('src', '/handoff/landing.dc.html');
});
