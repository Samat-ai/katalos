import { expect, it, vi } from 'vitest';

const { redirect } = vi.hoisted(() => ({ redirect: vi.fn() }));

vi.mock('next/navigation', () => ({ redirect }));

import SignInPage from './page';

it('redirects legacy sign-in links to the landing magic-link section', () => {
  SignInPage();

  expect(redirect).toHaveBeenCalledWith('/#sign-in');
});
