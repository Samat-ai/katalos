import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

const { redirect, createClient } = vi.hoisted(() => ({ redirect: vi.fn(), createClient: vi.fn() }));

vi.mock('next/navigation', () => ({ redirect }));
vi.mock('@/lib/supabase/server', () => ({ createClient }));
vi.mock('@/components/auth/OnboardingForm', () => ({ OnboardingForm: () => <form aria-label="Name your room" /> }));

import OnboardingPage from './page';

it('keeps Credits in the onboarding top bar', async () => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null });
  const eq = vi.fn().mockReturnValue({ maybeSingle });
  const select = vi.fn().mockReturnValue({ eq });
  createClient.mockResolvedValue({ auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } } }) }, from: vi.fn().mockReturnValue({ select }) });

  render(await OnboardingPage());

  expect(screen.getByRole('link', { name: 'Credits' })).toHaveAttribute('href', '/credits');
});
