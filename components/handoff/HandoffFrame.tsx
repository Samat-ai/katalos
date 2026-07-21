'use client';

import { useEffect, useRef } from 'react';

type HandoffFrameProps = {
  src: '/handoff/landing.dc.html' | '/handoff/owner.dc.html' | '/handoff/public.dc.html';
  title: string;
};

/** Mounts a supplied Design Canvas document unchanged. */
export function HandoffFrame({ src, title }: HandoffFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const onLoad = () => {
      const document = frame.contentDocument;
      if (!document) return;
      document.querySelectorAll('a[href="/signin"], [data-katalos-signin]').forEach((element) => {
        element.addEventListener('click', (event) => {
          event.preventDefault();
          window.location.assign('/signin');
        });
      });
    };
    frame.addEventListener('load', onLoad);
    return () => frame.removeEventListener('load', onLoad);
  }, []);

  return <iframe ref={frameRef} className="handoff-frame" src={src} title={title} />;
}
