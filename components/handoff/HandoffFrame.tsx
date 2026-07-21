'use client';

import { useEffect, useRef, useState } from 'react';
import type { HandoffShelves } from '@/lib/handoff/entries';

type HandoffFrameProps = {
  src: '/handoff/landing.dc.html' | '/handoff/owner.dc.html' | '/handoff/public.dc.html';
  title: string;
  shelves?: HandoffShelves;
};

export function findSignInControls(document: Document) {
  return [...document.querySelectorAll<HTMLElement>('a[href="/signin"], [data-katalos-signin], div')]
    .filter((element) => element.matches('a[href="/signin"], [data-katalos-signin]') || element.textContent?.trim() === 'MAKE YOUR ROOM');
}

export function wireLiteralControls(document: Document, onMakeRoom: () => void) {
  const listener = (event: Event) => { event.preventDefault(); onMakeRoom(); };
  const controls = findSignInControls(document);
  controls.forEach((element) => element.addEventListener('click', listener));
  return () => controls.forEach((element) => element.removeEventListener('click', listener));
}

/** Mounts a supplied Design Canvas document unchanged. */
export function HandoffFrame({ src, title, shelves }: HandoffFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>();

  useEffect(() => {
    if (!shelves) { setSrcDoc(undefined); return; }
    void fetch(new URL(src, window.location.origin)).then(async (response) => {
      const source = await response.text();
      const payload = JSON.stringify(shelves).replace(/</g, '\\u003c');
      setSrcDoc(source.replace('<head>', `<head><base href="${window.location.origin}/handoff/"><script>window.__KATALOS_ENTRIES=${payload};</script>`));
    }).catch(() => setSrcDoc(undefined));
  }, [shelves, src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const onLoad = () => {
      const document = frame.contentDocument;
      if (!document) return;
      wireLiteralControls(document, () => window.location.assign('/signin'));
    };
    frame.addEventListener('load', onLoad);
    return () => frame.removeEventListener('load', onLoad);
  }, []);

  return <iframe ref={frameRef} className="handoff-frame" src={srcDoc ? undefined : src} srcDoc={srcDoc} title={title} />;
}
