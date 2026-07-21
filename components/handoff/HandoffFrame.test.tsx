import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterEach, expect, it, vi } from 'vitest';
import { findSignInControls, HandoffFrame } from './HandoffFrame';

afterEach(() => vi.unstubAllGlobals());

it('mounts the supplied landing document without rewriting it', () => {
  render(<HandoffFrame src="/handoff/landing.dc.html" title="Katalos landing" />);
  expect(screen.getByTitle('Katalos landing')).toHaveAttribute('src', '/handoff/landing.dc.html');
});

it('injects live shelf data before mounting a literal room document', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('<html><head></head><body></body></html>')));
  render(<HandoffFrame src="/handoff/landing.dc.html" title="Momo's room" shelves={{ shelf1: [{ id: 'book-1', t: 'Book One', ty: 'book', st: 'finished', r: 0, n: '', syn: '', c: '#6fb3a4' }], shelf2: [], nowStack: [], pileBooks: [], cabinet: [], nowPlaying: [], watchNext: [], pausedTapes: [] }} />);

  await waitFor(() => expect(screen.getByTitle("Momo's room")).toHaveAttribute('srcdoc', expect.stringContaining('window.__KATALOS_ENTRIES')));
  expect(screen.getByTitle("Momo's room")).toHaveAttribute('srcdoc', expect.stringContaining('window.__KATALOS_PARENT_ORIGIN="http://localhost:3000"'));
  expect(screen.getByTitle("Momo's room")).toHaveAttribute('srcdoc', expect.stringContaining('Book One'));
});

it('sends hydrated shelf entry clicks to the live host', async () => {
  const source = await readFile(resolve(process.cwd(), 'public/handoff/landing.dc.html'), 'utf8');
  expect(source).toContain("window.parent.postMessage({ source: 'katalos-handoff', type: 'open-entry'");
});

it('recognizes literal make-your-room controls as sign-in actions', () => {
  const document = window.document.implementation.createHTMLDocument();
  document.body.innerHTML = '<div>MAKE YOUR ROOM</div><div>just decoration</div><a href="/signin">SIGN IN</a>';

  expect(findSignInControls(document)).toHaveLength(2);
});

it('exports a document-level literal control wiring helper', async () => {
  const module = await import('./HandoffFrame');
  expect(module).toHaveProperty('wireLiteralControls');
  const wireLiteralControls = (module as typeof module & { wireLiteralControls: (document: Document, onMakeRoom: () => void) => () => void }).wireLiteralControls;
  const document = window.document.implementation.createHTMLDocument();
  document.body.innerHTML = '<div>MAKE YOUR ROOM</div>';
  const onMakeRoom = vi.fn();

  const removeListeners = wireLiteralControls(document, onMakeRoom);
  document.querySelector('div')!.click();
  removeListeners();

  expect(onMakeRoom).toHaveBeenCalledOnce();
});

it('submits the literal magic-link email through a live callback', async () => {
  const module = await import('./HandoffFrame');
  expect(module).toHaveProperty('wireMagicLinkControl');
  const wireMagicLinkControl = (module as typeof module & { wireMagicLinkControl: (document: Document, submit: (email: string) => Promise<{ kind: 'sent' | 'error'; message: string }>) => () => void }).wireMagicLinkControl;
  const document = window.document.implementation.createHTMLDocument();
  document.body.innerHTML = '<div><input aria-label="Email address" value="momo@example.com"><button>SEND LINK</button></div><div></div>';
  const submit = vi.fn().mockResolvedValue({ kind: 'sent' as const, message: 'A real link is on its way.' });

  wireMagicLinkControl(document, submit);
  document.querySelector('button')!.click();

  await waitFor(() => expect(submit).toHaveBeenCalledWith('momo@example.com'));
  expect(document.body.lastElementChild?.textContent).toBe('A real link is on its way.');
});

it('wires the magic-link control after the Design Canvas boot event', async () => {
  const onMagicLink = vi.fn().mockResolvedValue({ kind: 'sent' as const, message: 'A real link is on its way.' });
  const { container } = render(<HandoffFrame src="/handoff/landing.dc.html" title="Katalos landing" onMagicLink={onMagicLink} />);
  const frame = container.querySelector('iframe')!;
  const frameDocument = window.document.implementation.createHTMLDocument();
  frameDocument.body.innerHTML = '<div><input aria-label="Email address" value="momo@example.com"><button>SEND LINK</button></div><div></div>';
  Object.defineProperty(frame, 'contentDocument', { configurable: true, value: frameDocument });

  fireEvent(window, new MessageEvent('message', { origin: window.location.origin, source: frame.contentWindow, data: { type: '__dc_booted' } }));
  frameDocument.querySelector('button')!.click();

  await waitFor(() => expect(onMagicLink).toHaveBeenCalledWith('momo@example.com'));
});

it('forwards a same-origin scene entry event to its live owner callback', () => {
  const onEntryOpen = vi.fn();
  const props = { src: '/handoff/landing.dc.html', title: 'Owner room', onEntryOpen } as unknown as React.ComponentProps<typeof HandoffFrame>;
  render(<HandoffFrame {...props} />);
  const frame = screen.getByTitle('Owner room');

  fireEvent(window, new MessageEvent('message', { origin: window.location.origin, source: frame.contentWindow, data: { source: 'katalos-handoff', type: 'open-entry', entryId: 'book-1' } }));

  expect(onEntryOpen).toHaveBeenCalledWith('book-1');
});
