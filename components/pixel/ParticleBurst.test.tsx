import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ParticleBurst } from './ParticleBurst';
import { ReadingNook } from '@/components/room/ReadingNook';

afterEach(() => { cleanup(); vi.restoreAllMocks(); vi.useRealTimers(); });

it('renders its particles inside a locally bounded burst', () => {
  const { container } = render(<ParticleBurst kind="heart" count={2} className="reading-particles" />);

  expect(container.querySelector('.particle-burst.reading-particles')).not.toBeNull();
  expect(container.querySelectorAll('.pixel-particle.heart')).toHaveLength(2);
});

it('clears a toy particle timer when its nook unmounts before expiry', () => {
  vi.useFakeTimers();
  const clearTimeout = vi.spyOn(window, 'clearTimeout');
  const { unmount } = render(<ReadingNook avatar="girl">children</ReadingNook>);
  fireEvent.click(screen.getByRole('button', { name: /pet the cat/i }));
  expect(vi.getTimerCount()).toBe(1);

  unmount();

  expect(clearTimeout).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
  expect(() => act(() => vi.runAllTimers())).not.toThrow();
});
