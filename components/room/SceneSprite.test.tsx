import { cleanup, render } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import { SceneSprite } from './SceneSprite';

afterEach(cleanup);

it('renders reader and watcher frames with their selected avatar classes', () => {
  const { container } = render(<><SceneSprite role="reader" avatar="girl" /><SceneSprite role="watcher" avatar="boy" /></>);

  expect(container.querySelector('.scene-sprite--reader.avatar-girl .sprite-head')).not.toBeNull();
  expect(container.querySelector('.scene-sprite--reader .sprite-book')).not.toBeNull();
  expect(container.querySelector('.scene-sprite--watcher.avatar-boy .sprite-profile')).not.toBeNull();
});

it('renders the cat as its own layered sprite', () => {
  const { container } = render(<SceneSprite role="cat" />);

  expect(container.querySelector('.scene-sprite--cat .sprite-tail')).not.toBeNull();
  expect(container.querySelector('.scene-sprite--cat .sprite-ears')).not.toBeNull();
});
