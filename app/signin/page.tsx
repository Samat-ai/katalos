import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { SiteNav } from '@/components/ui/SiteNav';

export default function SignInPage() {
  return <main className="home-page">
    <SiteNav actionHref="/" actionLabel="BACK HOME" />
    <section className="landing-signin pixel-panel">
      <p className="eyebrow">Welcome back</p>
      <h1>SIGN IN TO YOUR ROOM</h1>
      <p>Enter your email and we&apos;ll send a magic link.</p>
      <MagicLinkForm />
    </section>
  </main>;
}
