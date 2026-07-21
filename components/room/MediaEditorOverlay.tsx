'use client';

import { useEffect, useRef, type ReactNode } from 'react';

type MediaEditorOverlayProps = {
  title: string;
  children: ReactNode;
  onClose: () => void;
};

export function MediaEditorOverlay({ title, children, onClose }: MediaEditorOverlayProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [onClose]);

  return <div className="editor-layer"><button className="editor-scrim" aria-label="Close editor overlay" onClick={onClose} /><section className="media-editor-overlay" role="dialog" aria-modal="true" aria-label={title}><header className="editor-header"><h2>{title}</h2><button ref={closeButtonRef} type="button" aria-label="Close editor" onClick={onClose}>×</button></header>{children}</section></div>;
}
