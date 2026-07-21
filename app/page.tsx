import { MediaRoom } from '@/components/room/MediaRoom';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { demoEntries } from '@/lib/media/demo-data';

export default function Home() {
  return (
    <main className="home-page">
      <nav className="site-nav"><a className="brand logo-badge" href="/"><span aria-hidden="true" className="logo-pixel" />KATALOS</a><ThemeSwitcher /><a href="/signin">MAKE YOUR ROOM</a></nav>
      <header className="hero pixel-panel">
        <div className="hero-copy-block"><p className="eyebrow">A cozy room for your media</p><h1>KATALOS</h1><p className="hero-copy">Your books, manga, anime, and movies—shelved as a room you can share.</p><a className="pixel-link-button" href="/signin">MAKE YOUR ROOM</a></div>
        <aside className="hero-badge" aria-label="A tiny Katalos room"><span aria-hidden="true">✦</span><p>MAKE YOUR TASTE TANGIBLE</p></aside>
      </header>
      <section className="landing-room" aria-label="Featured media room">
        <p className="eyebrow">Momo&apos;s room · live demo — click any spine or tape</p>
        <MediaRoom entries={demoEntries.filter((entry) => entry.visibility === 'public')} readOnly owner={false} />
        <a className="wall-slice-signin" href="/signin">ALREADY HAVE A ROOM? SIGN IN</a>
      </section>
    </main>
  );
}
