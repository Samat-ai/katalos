import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

vi.mock('@/components/handoff/HandoffFrame', () => ({
  HandoffFrame: ({ onMakeRoom }: { onMakeRoom?: () => void }) => <button type="button" onClick={onMakeRoom}>MAKE YOUR ROOM</button>,
}));

import Home from './page';

it('scrolls directly to the landing magic-link area from Make your room', async () => {
  const user = userEvent.setup();
  const target = document.createElement('section');
  target.id = 'sign-in';
  target.scrollIntoView = vi.fn();
  document.body.append(target);
  render(<Home />);

  await user.click(screen.getByRole('button', { name: 'MAKE YOUR ROOM' }));

  expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
});
