'use client';

import { useEffect, useState } from 'react';

export type KatalosTheme = 'morning' | 'afternoon' | 'night';

const themes: Array<{ value: KatalosTheme; label: string; icon: string }> = [
  { value: 'morning', label: 'Morning theme', icon: '☼' },
  { value: 'afternoon', label: 'Afternoon theme', icon: '◐' },
  { value: 'night', label: 'Night theme', icon: '☾' },
];

export function getClockTheme(hour: number): KatalosTheme {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 19) return 'afternoon';
  return 'night';
}

export function applyTheme(theme: KatalosTheme) {
  document.documentElement.dataset.ktheme = theme;
}

export function ThemeManager() {
  useEffect(() => {
    const stored = window.localStorage.getItem('katalos_theme');
    const theme: KatalosTheme = stored === 'morning' || stored === 'afternoon' || stored === 'night'
      ? stored
      : getClockTheme(new Date().getHours());
    applyTheme(theme);
  }, []);

  return null;
}

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<KatalosTheme>('afternoon');

  useEffect(() => {
    const current = document.documentElement.dataset.ktheme;
    if (current === 'morning' || current === 'afternoon' || current === 'night') setTheme(current);
  }, []);

  function selectTheme(nextTheme: KatalosTheme) {
    setTheme(nextTheme);
    applyTheme(nextTheme);
    window.localStorage.setItem('katalos_theme', nextTheme);
  }

  return <div className="theme-switcher" aria-label="Room theme">
    {themes.map(({ value, label, icon }) => <button key={value} type="button" aria-label={label} aria-pressed={theme === value} onClick={() => selectTheme(value)}>
      <span aria-hidden="true">{icon}</span><span className="theme-switcher-label">{value}</span>
    </button>)}
  </div>;
}
