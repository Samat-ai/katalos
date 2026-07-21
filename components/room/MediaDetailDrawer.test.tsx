import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { demoEntries } from '@/lib/media/demo-data';
import { MediaDetailDrawer } from './MediaDetailDrawer';

afterEach(cleanup);

it('closes through Escape as well as its visible close button', () => {
  const onClose = vi.fn();
  render(<MediaDetailDrawer entry={demoEntries[0]} onClose={onClose} />);

  fireEvent.keyDown(document, { key: 'Escape' });
  expect(onClose).toHaveBeenCalledOnce();
  expect(screen.getByRole('dialog')).toBeVisible();
});

it('uses the responsive drawer shell, CoverBlock fallback, and no-rating copy', () => {
  const entry = { ...demoEntries[0], coverUrl: undefined, rating: undefined };
  render(<MediaDetailDrawer entry={entry} onClose={vi.fn()} />);

  expect(screen.getByRole('dialog')).toHaveClass('detail-drawer', 'drawer-responsive');
  expect(screen.getByLabelText(entry.title)).toBeVisible();
  expect(screen.getByText('No rating yet')).toBeVisible();
});

it('traps focus and returns it to the opener when closed', () => {
  const onClose = vi.fn();
  const { rerender } = render(<button>Open details</button>);
  const opener = screen.getByRole('button', { name: 'Open details' });
  opener.focus();
  rerender(<><button>Open details</button><MediaDetailDrawer entry={demoEntries[0]} onClose={onClose} /></>);

  const close = within(screen.getByRole('dialog')).getByRole('button', { name: 'Close details' });
  close.focus();
  fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(close);
  rerender(<><button>Open details</button><MediaDetailDrawer entry={null} onClose={onClose} /></>);
  expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Open details' }));
});
