import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import { PublicRoomActions } from './PublicRoomActions';

afterEach(cleanup);

it('copies the public room URL with feedback', async () => {
  const user = userEvent.setup();
  const writeText = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
  render(<PublicRoomActions username="momo" />);

  await user.click(screen.getByRole('button', { name: /copy room link/i }));

  expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/u/momo`);
  expect(screen.getByRole('button', { name: /copied/i })).toBeVisible();
});
