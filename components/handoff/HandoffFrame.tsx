'use client';

import { useEffect, useRef, useState } from 'react';
import type { HandoffShelves } from '@/lib/handoff/entries';

type HandoffFrameProps = {
  src: '/handoff/landing.dc.html' | '/handoff/owner.dc.html' | '/handoff/public.dc.html';
  title: string;
  shelves?: HandoffShelves;
  onEntryOpen?: (entryId: string) => void;
  onMakeRoom?: () => void;
  onMagicLink?: (email: string) => Promise<MagicLinkResult>;
};

export type MagicLinkResult = { kind: 'sent' | 'error'; message: string };

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

export function wireMagicLinkControl(document: Document, submit: (email: string) => Promise<MagicLinkResult>) {
  const button = [...document.querySelectorAll<HTMLButtonElement>('button')].find((element) => element.textContent?.trim() === 'SEND LINK');
  const input = document.querySelector<HTMLInputElement>('[aria-label="Email address"]');
  const message = button?.parentElement?.nextElementSibling as HTMLElement | null;
  if (!button || !input || !message) return () => {};
  const listener = async (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    button.disabled = true;
    button.textContent = 'SENDING…';
    message.textContent = 'Sending your link…';
    try {
      const result = await submit(input.value.trim());
      message.textContent = result.message;
    } catch {
      message.textContent = 'We could not send that link. Please retry.';
    } finally {
      button.disabled = false;
      button.textContent = 'SEND LINK';
    }
  };
  button.addEventListener('click', listener);
  return () => button.removeEventListener('click', listener);
}

/** Mounts a supplied Design Canvas document unchanged. */
export function HandoffFrame({ src, title, shelves, onEntryOpen, onMakeRoom, onMagicLink }: HandoffFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [srcDoc, setSrcDoc] = useState<string>();

  useEffect(() => {
    if (!shelves) { setSrcDoc(undefined); return; }
    void fetch(new URL(src, window.location.origin)).then(async (response) => {
      const source = await response.text();
      const payload = JSON.stringify(shelves).replace(/</g, '\\u003c');
      setSrcDoc(source.replace('<head>', `<head><base href="${window.location.origin}/handoff/"><script>window.__KATALOS_ENTRIES=${payload};window.__KATALOS_PARENT_ORIGIN=${JSON.stringify(window.location.origin)};</script>`));
    }).catch(() => setSrcDoc(undefined));
  }, [shelves, src]);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    let dispose = () => {};
    const attachControls = () => {
      dispose();
      const document = frame.contentDocument;
      if (!document) return;
      const removeLiteralControls = wireLiteralControls(document, onMakeRoom ?? (() => window.location.assign('/signin')));
      const removeMagicLinkControl = onMagicLink ? wireMagicLinkControl(document, onMagicLink) : () => {};
      dispose = () => { removeLiteralControls(); removeMagicLinkControl(); };
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== frame.contentWindow) return;
      const data = event.data as { source?: string; type?: string; entryId?: string } | null;
      if (data?.type === '__dc_booted') { attachControls(); return; }
      if (data?.source === 'katalos-handoff' && data.type === 'open-entry' && typeof data.entryId === 'string') onEntryOpen?.(data.entryId);
    };
    frame.addEventListener('load', attachControls);
    window.addEventListener('message', onMessage);
    attachControls();
    return () => { frame.removeEventListener('load', attachControls); window.removeEventListener('message', onMessage); dispose(); };
  }, [onEntryOpen, onMagicLink, onMakeRoom]);

  return <iframe ref={frameRef} className="handoff-frame" src={srcDoc ? undefined : src} srcDoc={srcDoc} title={title} />;
}
