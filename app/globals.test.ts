import { readFileSync } from 'node:fs';
import path from 'node:path';
import { expect, it } from 'vitest';

const css = readFileSync(path.resolve(process.cwd(), 'app/globals.css'), 'utf8');

it('defines the afternoon theme instead of relying on unscoped defaults', () => {
  expect(css).toContain(":root[data-ktheme='afternoon']");
});

it('uses the handoff night-pixel palette as the unscoped default', () => {
  expect(css).toContain('--k-pageBg:#14172A');
  expect(css).toContain('--k-panel:#242842');
  expect(css).toContain('--k-accent:#7FE3DE');
  expect(css).toContain('background-size:15px 15px,23px 23px;');
});

it('keeps every time-of-day variant inside the night-pixel visual system', () => {
  expect(css).toContain(":root[data-ktheme='morning'] { color-scheme:dark;");
  expect(css).toContain(":root[data-ktheme='afternoon'] { color-scheme:dark;");
  expect(css).toContain(":root[data-ktheme='night'] { color-scheme:dark;");
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

it('styles upstream room controls with the same dark handoff palette', () => {
  expect(css).toContain('.handoff-owner-actions { color:var(--k-panelText);');
  expect(css).toContain('.editor-layer { position:fixed;');
});
