import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { AvatarPicker } from './AvatarPicker';

it('emits the selected boy avatar', () => {
  const onChange = vi.fn();
  render(<AvatarPicker value="girl" onChange={onChange} />);

  fireEvent.click(screen.getByRole('button', { name: 'BOY' }));

  expect(onChange).toHaveBeenCalledWith('boy');
});
