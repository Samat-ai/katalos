import { ThemeSwitcher } from './ThemeSwitcher';

type SiteNavProps = {
  actionHref: string;
  actionLabel: string;
};

export function SiteNav({ actionHref, actionLabel }: SiteNavProps) {
  return <nav className="site-nav" aria-label="Katalos navigation">
    <a className="brand logo-badge" href="/"><span aria-hidden="true" className="logo-pixel" />KATALOS</a>
    <div role="group" aria-label="Room theme"><ThemeSwitcher /></div>
    <a className="site-nav-action" href={actionHref}>{actionLabel}</a>
  </nav>;
}
