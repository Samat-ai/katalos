import { MediaRoom } from '@/components/room/MediaRoom';
import { demoEntries } from '@/lib/media/demo-data';

export default function Home() {
  return (
    <main className="home-page">
      <header className="hero">
        <h1>Katalos</h1>
        <p>Your taste, made explorable.</p>
      </header>
      <MediaRoom entries={demoEntries} readOnly />
    </main>
  );
}
