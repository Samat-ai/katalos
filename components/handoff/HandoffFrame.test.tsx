import { render, screen, waitFor } from '@testing-library/react';
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
  expect(screen.getByTitle("Momo's room")).toHaveAttribute('srcdoc', expect.stringContaining('Book One'));
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
