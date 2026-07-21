import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function SignInPage() {
  return <main className="home-page">
    <nav className="site-nav"><a className="brand" href="/">KATALOS</a><ThemeSwitcher /><a href="/">BACK HOME</a></nav>
    <section className="landing-signin pixel-panel">
      <p className="eyebrow">Welcome back</p>
      <h1>SIGN IN TO YOUR ROOM</h1>
      <p>Enter your email and we&apos;ll send a magic link.</p>
      <MagicLinkForm />
    </section>
  </main>;
}
