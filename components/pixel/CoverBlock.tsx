'use client';

import { useState } from 'react';

export type CoverBlockProps = {
  title: string;
  coverUrl: string | null | undefined;
  className?: string;
};

function getInitials(title: string) {
  return title
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase() || '?';
}

export function CoverBlock({ title, coverUrl, className }: CoverBlockProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const coverSrc = !hasImageError && coverUrl ? coverUrl : undefined;

  return (
    <div className={['cover-block', className].filter(Boolean).join(' ')} aria-label={title}>
      {coverSrc ? (
        <img src={coverSrc} alt={title} onError={() => setHasImageError(true)} />
      ) : (
        <span className="cover-block-initials" aria-hidden="true">{getInitials(title)}</span>
      )}
    </div>
  );
}
