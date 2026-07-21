import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { demoEntries } from '@/lib/media/demo-data';
import { MediaRoom } from './MediaRoom';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

it('updates each fixed nook scale when its wrapper is observed resizing', () => {
  const observers: ResizeObserverCallback[] = [];
  class ResizeObserverStub {
    constructor(callback: ResizeObserverCallback) { observers.push(callback); }
    observe() {}
    disconnect() {}
    unobserve() {}
  }
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(208);

  const { container } = render(<MediaRoom entries={demoEntries} readOnly />);
  observers.forEach((callback) => callback([], {} as ResizeObserver));

  expect([...container.querySelectorAll<HTMLElement>('.knookwrap')]).toHaveLength(2);
  expect([...container.querySelectorAll<HTMLElement>('.knookwrap')].every((wrapper) => wrapper.style.getPropertyValue('--kscale') === '0.5')).toBe(true);
});

it('opens a selected media entry in the detail drawer', async () => {
  const user = userEvent.setup();

  render(<MediaRoom entries={demoEntries} readOnly />);

  await user.click(screen.getByRole('button', { name: /spirited away/i }));

  expect(screen.getByText(/a beloved fantasy/i)).toBeVisible();
});

it('exposes labeled reading and TV regions with selectable media covers', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);

  expect(screen.getByRole('region', { name: /reading nook/i })).toBeVisible();
  expect(screen.getByRole('region', { name: /tv nook/i })).toBeVisible();
  expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
  expect(screen.getByRole('region', { name: /reading nook/i }).closest('.knookwrap')).not.toBeNull();
});

it('shows a themed title tooltip instead of relying on a browser title tooltip', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);
  fireEvent.mouseEnter(screen.getByRole('button', { name: /spirited away/i }));

  expect(screen.getByRole('tooltip')).toHaveTextContent(/spirited away.*movie/i);
});

it('offers the small room toys as keyboard-accessible controls', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);

  expect(screen.getByRole('button', { name: /pet the cat/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /toggle reading lamp/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /change channel/i })).toBeVisible();
});

it('layers a woven rug and lamp wedge into the reading scene', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);

  const readingNook = screen.getByRole('region', { name: /reading nook/i });
  expect(readingNook.querySelector('.scene-rug')).not.toBeNull();
  expect(screen.getByRole('button', { name: /toggle reading lamp/i }).querySelector('.lamp-wedge')).not.toBeNull();
});

it('cycles the TV into its playable Pong channel', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  render(<MediaRoom entries={demoEntries} readOnly />);
  fireEvent.click(screen.getByRole('button', { name: /change channel/i }));

  expect(screen.getByRole('application', { name: /playable pong/i })).toBeVisible();
});

it('cycles the TV from channel one through five and back to one', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);
  const channel = screen.getByRole('button', { name: /change channel/i });

  fireEvent.click(channel);
  fireEvent.click(channel);
  fireEvent.click(channel);
  fireEvent.click(channel);
  expect(screen.getByLabelText('TV channel 5')).toBeVisible();

  fireEvent.click(channel);
  expect(screen.getByLabelText('TV channel 1')).toBeVisible();
});

it('removes the active Pong canvas when the TV is powered off', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  render(<MediaRoom entries={demoEntries} readOnly />);
  fireEvent.click(screen.getByRole('button', { name: /change channel/i }));
  expect(screen.getByRole('application', { name: /playable pong/i })).toBeVisible();

  fireEvent.click(screen.getByRole('button', { name: /power on or off/i }));
  expect(screen.queryByRole('application', { name: /playable pong/i })).not.toBeInTheDocument();
  expect(screen.getByLabelText('TV off')).toBeVisible();
});

it('uses themed tooltips for toy labels and cleans up locally rendered particles', () => {
  vi.useFakeTimers();
  render(<MediaRoom entries={demoEntries} readOnly />);
  const cat = screen.getByRole('button', { name: /pet the cat/i });

  fireEvent.focus(cat);
  expect(screen.getByRole('tooltip')).toHaveTextContent(/pet the cat/i);
  fireEvent.click(cat);
  expect(cat.closest('[aria-label="Reading nook"]')?.querySelector('.particle-burst .pixel-particle.heart')).not.toBeNull();

  act(() => vi.advanceTimersByTime(800));
  expect(cat.closest('[aria-label="Reading nook"]')?.querySelector('.particle-burst')).toBeNull();
  vi.useRealTimers();
});

it('toggles only the lamp glow', () => {
  render(<MediaRoom entries={demoEntries} readOnly />);
  const lamp = screen.getByRole('button', { name: /toggle reading lamp/i });
  const nook = lamp.closest('[aria-label="Reading nook"]');

  fireEvent.click(lamp);
  expect(nook?.querySelector('.lamp-glow')).not.toHaveClass('is-on');
  expect(nook?.querySelector('.particle-burst')).toBeNull();
});
