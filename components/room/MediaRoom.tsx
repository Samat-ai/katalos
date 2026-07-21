'use client';

import { useState } from 'react';
import type { MediaEntry, RoomZone } from '@/lib/media/types';
import { MediaDetailDrawer } from './MediaDetailDrawer';
import { RoomScene } from './RoomScene';

export function MediaRoom({ entries, readOnly = false, avatar = 'girl', owner = !readOnly, onZoneOverflow = () => {} }: { entries: MediaEntry[]; readOnly?: boolean; avatar?: 'girl' | 'boy'; owner?: boolean; onZoneOverflow?: (zone: RoomZone) => void }) {
  const [selected, setSelected] = useState<MediaEntry | null>(null);

  return <><RoomScene entries={entries} avatar={avatar} owner={owner} onSelect={setSelected} onZoneOverflow={onZoneOverflow} /><MediaDetailDrawer entry={selected} onClose={() => setSelected(null)} /></>;
}
