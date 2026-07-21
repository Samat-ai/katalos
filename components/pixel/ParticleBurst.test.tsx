import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { ParticleBurst } from './ParticleBurst';

afterEach(cleanup);

it('renders its particles inside a locally bounded burst', () => {
  const { container } = render(<ParticleBurst kind="heart" count={2} className="reading-particles" />);

  expect(container.querySelector('.particle-burst.reading-particles')).not.toBeNull();
  expect(container.querySelectorAll('.pixel-particle.heart')).toHaveLength(2);
});
