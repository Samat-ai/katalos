import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { PongChannel } from './PongChannel';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function mockCanvasContext() {
  return { fillRect: vi.fn(), fillText: vi.fn(), fillStyle: '', font: '' } as unknown as CanvasRenderingContext2D;
}

it('starts animation only while the active canvas is visible and connected', () => {
  const observers: IntersectionObserverCallback[] = [];
  class IntersectionObserverStub {
    constructor(callback: IntersectionObserverCallback) { observers.push(callback); }
    observe() {}
    disconnect() {}
    unobserve() {}
    takeRecords() { return []; }
    root = null;
    rootMargin = '0px';
    thresholds = [];
  }
  vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  const requestFrame = vi.fn(() => 7);
  const cancelFrame = vi.fn();
  vi.stubGlobal('requestAnimationFrame', requestFrame);
  vi.stubGlobal('cancelAnimationFrame', cancelFrame);

  const { rerender } = render(<PongChannel active={false} />);
  act(() => observers[0]([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(requestFrame).not.toHaveBeenCalled();

  rerender(<PongChannel active />);
  expect(requestFrame).toHaveBeenCalledTimes(1);
  act(() => observers[0]([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver));
  expect(cancelFrame).toHaveBeenCalledWith(7);
});

it('draws one static frame without scheduling animation for reduced motion', () => {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  const requestFrame = vi.fn(() => 7);
  vi.stubGlobal('requestAnimationFrame', requestFrame);

  render(<PongChannel active />);

  expect(requestFrame).not.toHaveBeenCalled();
});

it('keeps keyboard paddle controls and describes every supported control', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  render(<PongChannel active />);
  const canvas = screen.getByRole('application', { name: /playable pong/i });

  expect(fireEvent.keyDown(canvas, { key: 'ArrowUp' })).toBe(false);
  expect(fireEvent.keyDown(canvas, { key: 's' })).toBe(false);
  expect(canvas).toHaveAccessibleName(/mouse, arrow keys, or w and s/i);
});
