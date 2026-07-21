type SpriteRole = 'reader' | 'watcher' | 'cat';
type Avatar = 'girl' | 'boy';

export function SceneSprite({ role, avatar }: { role: SpriteRole; avatar?: Avatar }) {
  const avatarClass = avatar ? ` avatar-${avatar}` : '';

  if (role === 'cat') {
    return <span className="scene-sprite scene-sprite--cat" aria-hidden="true"><span className="sprite-tail" /><span className="sprite-body" /><span className="sprite-ears" /><span className="sprite-face" /></span>;
  }

  return <span className={`scene-sprite scene-sprite--${role}${avatarClass}`} aria-hidden="true"><span className="sprite-head"><span className="sprite-eyes" /></span><span className="sprite-hair" /><span className="sprite-body" />{role === 'reader' ? <span className="sprite-book" /> : <span className="sprite-profile" />}</span>;
}
