import { SiteNav } from '@/components/ui/SiteNav';

export default function CreditsPage() {
  return <main className="owner-page app-stage">
    <SiteNav actionHref="/" actionLabel="BACK HOME" />
    <header><div><p className="eyebrow">Data, images & type</p><h1>CREDITS</h1><p>Katalos uses catalog providers only to help curators begin an entry. You choose what belongs in your room.</p></div></header>
    <div className="credits-stack">
      <section className="taste-card">
        <h2>Open Library</h2>
        <p>Book search and cover metadata are provided by <a href="https://openlibrary.org/">Open Library</a>. Katalos caches low-volume searches and identifies itself to the service.</p>
      </section>
      <section className="taste-card">
        <h2>Jikan</h2>
        <p>Anime and manga search data are provided through <a href="https://jikan.moe/">Jikan</a>, with <a href="https://anilist.co/">AniList</a> as an outage fallback.</p>
        <p>Jikan is not affiliated with MyAnimeList.net.</p>
      </section>
      <section className="taste-card">
        <h2>TMDB</h2>
        <a className="tmdb-logo" href="https://www.themoviedb.org/about/logos-attribution" aria-label="TMDB logos and attribution"><img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg" alt="The Movie Database (TMDB)" /></a>
        <p>Movie data and images are provided by <a href="https://www.themoviedb.org/">TMDB</a>.</p>
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </section>
      <section className="taste-card">
        <h2>Taste Profiler</h2>
        <p>Taste Profiler is generated with Google Gemini from public entries only.</p>
      </section>
      <section className="taste-card">
        <h2>Type</h2>
        <p>Press Start 2P and VT323 are provided by Google Fonts under the OFL.</p>
      </section>
    </div>
  </main>;
}
