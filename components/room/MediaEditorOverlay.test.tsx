import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { MediaEditorOverlay } from './MediaEditorOverlay';

afterEach(cleanup);

it('closes the media editor overlay with Escape', () => {
  const onClose = vi.fn();
  render(<MediaEditorOverlay title="ADD MEDIA" onClose={onClose}><button>SAVE TO ROOM</button></MediaEditorOverlay>);

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(onClose).toHaveBeenCalledOnce();
  expect(screen.getByRole('dialog', { name: 'ADD MEDIA' })).toBeVisible();
});

it('exposes a labeled scrim and visible close control', () => {
  render(<MediaEditorOverlay title="EDIT MEDIA" onClose={vi.fn()}><p>Form</p></MediaEditorOverlay>);

  expect(screen.getByRole('button', { name: 'Close editor' })).toBeVisible();
  expect(screen.getByRole('button', { name: 'Close editor overlay' })).toBeVisible();
});
