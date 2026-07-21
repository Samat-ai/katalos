import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { MediaRoom } from '@/components/room/MediaRoom';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';
import { demoEntries } from '@/lib/media/demo-data';

export default function Home() {
  return (
    <main className="home-page">
      <nav className="site-nav"><a className="brand" href="/">KATALOS</a><ThemeSwitcher /><a href="#make-your-room">MAKE YOUR ROOM</a></nav>
      <header className="hero pixel-panel">
        <p className="eyebrow">A cozy room for your media</p>
        <h1>KATALOS</h1>
        <p className="hero-copy">Your books, manga, anime, and movies—shelved as a room you can share.</p>
        <a className="pixel-link-button" href="#make-your-room">MAKE YOUR ROOM</a>
      </header>
      <section className="landing-room" aria-label="Featured media room">
        <p className="eyebrow">Momo&apos;s room · live demo — click any spine or tape</p>
        <MediaRoom entries={demoEntries.filter((entry) => entry.visibility === 'public')} readOnly />
      </section>
      <section id="make-your-room" className="landing-signin pixel-panel">
        <h2>GOT A ROOM ALREADY?</h2>
        <p>Enter your email and we&apos;ll send a magic link.</p>
        <MagicLinkForm />
      </section>
    </main>
  );
}
