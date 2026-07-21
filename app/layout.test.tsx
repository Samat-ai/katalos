import { readFileSync } from 'node:fs';
import path from 'node:path';
import { cleanup, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, expect, it } from 'vitest';
import RootLayout from './layout';

const footerRule = readFileSync(path.resolve(process.cwd(), 'app/globals.css'), 'utf8').match(/\.site-footer-link\s*\{[^}]+\}/)?.[0];

beforeEach(() => {
  const styles = document.createElement('style');
  styles.dataset.testFooterStyle = 'true';
  styles.textContent = footerRule;
  document.head.append(styles);
});

afterEach(() => {
  cleanup();
  document.querySelector('[data-test-footer-style="true"]')?.remove();
  document.body.innerHTML = '';
});

it('renders the Credits footer link as a 44px target', () => {
  document.body.innerHTML = renderToStaticMarkup(<RootLayout><main>Page content</main></RootLayout>);

  const creditsLink = screen.getByRole('link', { name: 'Credits' });
  expect(creditsLink).toHaveClass('site-footer-link');
  expect(getComputedStyle(creditsLink).minWidth).toBe('44px');
  expect(getComputedStyle(creditsLink).minHeight).toBe('44px');
});
