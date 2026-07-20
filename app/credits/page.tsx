export default function CreditsPage() {
  return <main className="owner-page">
    <header><div><p className="eyebrow">Data, images & type</p><h1>CREDITS</h1><p>Katalos uses catalog providers only to help curators begin an entry. You choose what belongs in your room.</p></div></header>
    <section className="taste-card">
      <h2>Open Library</h2>
      <p>Book search and cover metadata are provided by <a href="https://openlibrary.org/">Open Library</a>. Katalos caches low-volume searches and identifies itself to the service.</p>
    </section>
    <section className="taste-card">
      <h2>Jikan</h2>
      <p>Anime and manga search data are provided through <a href="https://jikan.moe/">Jikan</a>. Jikan is not affiliated with MyAnimeList.net.</p>
    </section>
    <section className="taste-card">
      <h2>TMDB</h2>
      <p>Movie data and images are provided by <a href="https://www.themoviedb.org/">TMDB</a>. This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
    </section>
    <section className="taste-card">
      <h2>Taste Profiler</h2>
      <p>Taste Profiler is generated with Google Gemini from public entries only.</p>
    </section>
    <section className="taste-card">
      <h2>Type</h2>
      <p>Press Start 2P and VT323 are provided by Google Fonts under the OFL.</p>
    </section>
  </main>;
}
