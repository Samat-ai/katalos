import { MagicLinkForm } from '@/components/auth/MagicLinkForm';

export default function Home() {
  return (
    <main className="home-page">
      <header className="hero">
        <h1>Katalos</h1>
        <p>Make your media taste tangible and shareable—without sharing what you keep private.</p>
        <MagicLinkForm />
      </header>
    </main>
  );
}
