import { MagicLinkForm } from '@/components/auth/MagicLinkForm';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function SignInPage() {
  return <main className="handoff-auth-page">
    <nav className="handoff-topbar"><a className="handoff-wordmark" href="/">KATALOS</a><ThemeSwitcher /><a href="/">← BACK HOME</a></nav>
    <section className="handoff-auth-panel" aria-labelledby="signin-title">
      <div className="handoff-wall-slice" aria-hidden="true"><span /><i /></div>
      <div className="handoff-auth-content">
        <h1 id="signin-title">GET YOUR MAGIC LINK</h1>
        <p>No password. We email you a key to your room.</p>
        <MagicLinkForm />
        <p className="handoff-auth-hint">New here? The same link creates your room on first use.</p>
      </div>
    </section>
  </main>;
}
