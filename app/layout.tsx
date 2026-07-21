import type { Metadata } from 'next';
import './globals.css';
import { ThemeManager } from '@/components/ui/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Katalos',
  description: 'Your taste, made explorable.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com" /><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" /><link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet" /></head><body><ThemeManager />{children}<footer className="site-footer"><a className="site-footer-link" href="/credits">Credits</a></footer></body></html>;
}
