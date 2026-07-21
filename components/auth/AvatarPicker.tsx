'use client';

export function AvatarPicker({ value, onChange }: { value: 'girl' | 'boy'; onChange: (avatar: 'girl' | 'boy') => void }) {
  return <section className="avatar-picker">
    <h3>WHO&apos;S IN YOUR ROOM?</h3>
    <div>
      <button type="button" aria-pressed={value === 'girl'} onClick={() => onChange('girl')}><span className="avatar-preview girl" aria-hidden="true" />GIRL</button>
      <button type="button" aria-pressed={value === 'boy'} onClick={() => onChange('boy')}><span className="avatar-preview boy" aria-hidden="true" />BOY</button>
    </div>
    <p>Same sprite reads and watches in both nooks · changeable later.</p>
  </section>;
}
