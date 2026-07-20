import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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
