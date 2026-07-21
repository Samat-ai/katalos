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

it('describes every supported keyboard paddle control', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(mockCanvasContext());
  render(<PongChannel active />);
  const canvas = screen.getByRole('application', { name: /playable pong/i });

  expect(canvas).toHaveAccessibleName(/mouse, arrow keys, or w and s/i);
});

it.each([
  ['ArrowUp', 'up'], ['w', 'up'], ['ArrowDown', 'down'], ['s', 'down'],
] as const)('moves the player paddle %s when pressed', (key, direction) => {
  const context = mockCanvasContext();
  const frames: FrameRequestCallback[] = [];
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
  vi.stubGlobal('requestAnimationFrame', vi.fn((callback: FrameRequestCallback) => { frames.push(callback); return frames.length; }));
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  render(<PongChannel active />);
  const canvas = screen.getByRole('application', { name: /playable pong/i });
  const paddleY = () => [...(context.fillRect as ReturnType<typeof vi.fn>).mock.calls].filter(([x, , width, height]) => x === 2 && width === 4 && height === 22).at(-1)?.[1] as number;
  const initialY = paddleY();

  fireEvent.keyDown(canvas, { key });
  act(() => frames[0](0));

  expect(paddleY()).toSatisfy((nextY) => direction === 'up' ? nextY < initialY : nextY > initialY);
  fireEvent.keyUp(canvas, { key });
});
