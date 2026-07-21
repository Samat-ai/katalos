import type { CSSProperties } from 'react';

export type TooltipAnchorRect = Pick<DOMRect, 'left' | 'top' | 'width'>;

export type PixelTooltipProps = {
  label: string;
  anchorRect: TooltipAnchorRect;
};

export function PixelTooltip({ label, anchorRect }: PixelTooltipProps) {
  const style: CSSProperties = {
    left: anchorRect.left + anchorRect.width / 2,
    top: anchorRect.top,
  };

  return <span className="pixel-tooltip" role="tooltip" style={style}>{label}</span>;
}
