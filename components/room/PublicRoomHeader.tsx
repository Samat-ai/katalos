import { PublicRoomActions } from './PublicRoomActions';

export function PublicRoomHeader({ displayName, username, publicCount }: { displayName: string; username: string; publicCount: number }) {
  const countLabel = `${publicCount} ${publicCount === 1 ? 'THING' : 'THINGS'} SHARED`;
  return <header className="public-room-header"><div><p className="eyebrow">@{username}</p><h1>{displayName}&apos;s room</h1><p className="room-url">/u/{username}</p><p className="public-count">{countLabel}</p></div><div className="public-room-actions"><PublicRoomActions username={username} /><a className="pixel-link-button" href="/signin">MAKE YOUR OWN</a></div></header>;
}
