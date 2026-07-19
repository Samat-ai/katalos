import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Katalos',
  description: 'Your taste, made explorable.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<footer className="site-footer"><a href="/credits">Credits</a></footer></body></html>;
}
