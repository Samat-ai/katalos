import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { MediaRoom } from '@/components/room/MediaRoom';
import { demoEntries } from '@/lib/media/demo-data';

export default function Home() {
  return (
    <main className="home-page">
      <header className="hero">
        <p className="eyebrow">A tiny museum of what moves you</p>
        <h1>Katalos</h1>
        <p>Explore a room first. Make your own when it feels like home.</p>
        <MagicLinkForm />
      </header>
      <section aria-label="Featured media room">
        <p className="eyebrow">Featured room</p>
        <MediaRoom entries={demoEntries.filter((entry) => entry.visibility === 'public')} readOnly />
      </section>
    </main>
  );
}
