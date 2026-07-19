import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { OwnerRoomClient } from './OwnerRoomClient';

it('opens the first-add flow for a new room', () => {
  render(<OwnerRoomClient initialEntries={[]} username="katalos" />);
  expect(screen.getByRole('heading', { name: /add media/i })).toBeVisible();
  expect(screen.getByText(/room is ready for its first story/i)).toBeVisible();
});
