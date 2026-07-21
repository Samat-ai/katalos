import { cleanup, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, expect, it } from 'vitest';
import RootLayout from './layout';

afterEach(() => {
  cleanup();
  document.body.innerHTML = '';
});

it('does not add a global Credits footer to every route', () => {
  document.body.innerHTML = renderToStaticMarkup(<RootLayout><main>Page content</main></RootLayout>);

  expect(document.querySelector('footer.site-footer')).toBeNull();
  expect(screen.queryByRole('link', { name: 'Credits' })).toBeNull();
});
