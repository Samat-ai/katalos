import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const css = readFileSync(path.resolve(process.cwd(), 'app/globals.css'), 'utf8');

it('defines the afternoon theme instead of relying on unscoped defaults', () => {
  expect(css).toContain(":root[data-ktheme='afternoon']");
});

it('turns off room movement when reduced motion is requested', () => {
  expect(css).toContain('animation:none !important; transition:none !important;');
  expect(css).toContain('.media-cover,.media-cover:hover,.media-cover:focus-visible { transform:none !important; }');
});

it('keeps non-scene controls at the 44px target size', () => {
  expect(css).toContain('.theme-switcher button { min-width:44px; min-height:44px;');
  expect(css).toContain('.manage-row button { min-width:44px; min-height:44px;');
  expect(css).toContain('.catalog-results button { min-width:44px; min-height:44px;');
  expect(css).toContain('.site-nav > a:last-child { display:inline-flex; min-width:44px; min-height:44px;');
  expect(css).toContain('.scene-toy,.tv-knob { position:absolute; z-index:6; min-width:0; min-height:0;');
});
