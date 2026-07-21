'use client';

export function RoomActionBar({ displayName, username, onAdd, onCopy }: { displayName: string; username: string; onAdd: () => void; onCopy: () => void }) {
  return <header className="room-action-bar"><div><p className="eyebrow">@{username}</p><h1>{displayName}&apos;s room</h1><p className="room-url">/u/{username}</p></div><div className="room-action-buttons"><button type="button" onClick={onAdd}>+ ADD MEDIA</button><button type="button" onClick={onCopy}>COPY PUBLIC LINK</button></div></header>;
}
