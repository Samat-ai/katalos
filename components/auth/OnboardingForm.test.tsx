import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { OnboardingForm } from './OnboardingForm';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));

beforeEach(() => {
  replace.mockReset();
  refresh.mockReset();
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ profile: { username: 'momo', avatar: 'boy' } }) }));
});
afterEach(cleanup);

it('posts the avatar selected during onboarding', async () => {
  render(<OnboardingForm />);

  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'momo' } });
  fireEvent.click(screen.getByRole('button', { name: 'BOY' }));
  fireEvent.click(screen.getByRole('button', { name: 'Create my room' }));

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]?.body as string)).toEqual({
    displayName: 'Momo',
    username: 'momo',
    avatar: 'boy',
  });
  expect(replace).toHaveBeenCalledWith('/room?add=1');
});

it('shows the public room URL preview', () => {
  render(<OnboardingForm />);

  expect(screen.getByText('www.katalos.tech/u/<username>')).toBeInTheDocument();
});
