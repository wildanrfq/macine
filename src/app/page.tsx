import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getCachedFilms } from "@/lib/films";
import { getFilmPalette } from "@/lib/film-palettes";

export const revalidate = 60;

export default async function HomePage() {
  const films = await getCachedFilms();

  const featuredFilm = films.find((f) => f.isNowShowing) || films[0];
  const otherFilms = films.filter((f) => f.id !== featuredFilm?.id);
  const nowShowing = otherFilms.filter((f) => f.isNowShowing);
  const comingSoon = films.filter((f) => f.isComingSoon);

  const palette = featuredFilm ? getFilmPalette(featuredFilm.slug || featuredFilm.id) : null;

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1">
        {/* Editorial Poster-forward Hero with Curated Film Accent */}
        {featuredFilm && palette && (
          <section className="relative overflow-hidden border-b border-line bg-paper py-10 sm:py-16 md:py-20">
            {/* 35mm film grain overlay */}
            <div className="pointer-events-none absolute inset-0 film-grain opacity-40 dark:opacity-30" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-12">
                {/* Poster column: physical print framing with sharp edges & offset shadow */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start">
                  <div className="relative aspect-[2/3] w-full max-w-[280px] sm:max-w-sm rounded-none border border-line bg-paper-card p-2 sm:p-2.5 shadow-[4px_4px_0px_0px_rgba(18,17,16,0.12)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                    <div className="relative h-full w-full overflow-hidden bg-ink rounded-none">
                      <Image
                        src={featuredFilm.posterUrl}
                        alt={featuredFilm.title}
                        width={400}
                        height={600}
                        priority
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                      />
                    </div>
                  </div>
                </div>

                {/* Details column */}
                <div className="lg:col-span-7">
                  {/* Curator Eyebrow with film-specific accent dot */}
                  <div className="inline-flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: palette.accent }}
                    />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-reel">
                      Kurasi Sinema Pekan Ini
                    </span>
                  </div>

                  {/* Title: Fraunces editorial serif */}
                  <h1 className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl break-words leading-[1.05]">
                    {featuredFilm.title}
                  </h1>

                  {featuredFilm.originalTitle && (
                    <p className="mt-1.5 font-display text-base sm:text-lg italic text-reel">
                      {featuredFilm.originalTitle} ({featuredFilm.releaseYear})
                    </p>
                  )}

                  {/* Badges: Monochrome 1px border boxes, uniform text */}
                  <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 text-xs font-mono text-ink/75 dark:text-ink/80">
                    <span className="border border-line bg-transparent px-2.5 py-1 tracking-tight">
                      {featuredFilm.genre}
                    </span>
                    <span className="border border-line bg-transparent px-2.5 py-1 tracking-tight">
                      {featuredFilm.durationMinutes} Menit
                    </span>
                    <span className="border border-line bg-transparent px-2.5 py-1 tracking-tight">
                      Klasifikasi {featuredFilm.rating}
                    </span>
                    <span className="border border-line bg-transparent px-2.5 py-1 text-reel tracking-tight">
                      Sutradara: {featuredFilm.director}
                    </span>
                  </div>

                  {/* Synopsis: Public Sans body text */}
                  <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-ink/85 font-sans">
                    {featuredFilm.synopsis}
                  </p>

                  {/* Showtimes: Ticket-stub cards with vertical accent bar & monospace time */}
                  <div className="mt-6 sm:mt-8 border-t border-line pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-reel">
                        Jadwal Pemutaran Hari Ini
                      </span>
                      <span className="text-[11px] font-mono text-reel">
                        Pilih jam pemutaran untuk memilih kursi
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2.5 sm:gap-3">
                      {featuredFilm.showtimes.length > 0 ? (
                        featuredFilm.showtimes.map((st) => {
                          const timeStr = new Date(st.startTime).toLocaleTimeString(
                            "id-ID",
                            { hour: "2-digit", minute: "2-digit" }
                          );
                          return (
                            <Link
                              key={st.id}
                              href={`/book/${st.id}`}
                              className="group relative flex flex-1 sm:flex-initial items-center gap-3 rounded-xs border border-line bg-paper-card px-3.5 py-2.5 text-sm transition-all hover:border-ink/40 dark:hover:border-ink/60"
                              style={{
                                borderLeftWidth: "3px",
                                borderLeftColor: palette.accent,
                              }}
                            >
                              <span className="font-mono text-base font-bold tracking-tight text-ink">
                                {timeStr}
                              </span>
                              <span className="border-l border-line/70 pl-2.5 font-mono text-[11px] uppercase tracking-wider text-reel group-hover:text-ink transition-colors">
                                {st.auditorium}
                              </span>
                            </Link>
                          );
                        })
                      ) : (
                        <p className="text-sm font-mono text-reel">
                          Belum ada jadwal tayang hari ini.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* CTA & Price: Medium radius button with curated accent & terminal price */}
                  <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <Link
                      href={`/films/${featuredFilm.slug || featuredFilm.id}`}
                      className="inline-flex items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium transition-opacity hover:opacity-90 shadow-xs"
                      style={{
                        backgroundColor: palette.accent,
                        color: palette.accentText,
                      }}
                    >
                      Detail Film & Sinopsis
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start gap-2.5 font-mono text-ink">
                      <span className="text-xs uppercase tracking-wider text-reel">Tarif</span>
                      <span className="text-lg font-bold tracking-tight">
                        Rp {featuredFilm.price.toLocaleString("id-ID")}
                      </span>
                      <span className="text-xs font-normal text-reel">/ kursi</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Other Now Showing Catalog */}
        <section className="border-b border-line py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3 border-b border-line pb-4">
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl">
                  Tayang Pekan Ini
                </h2>
                <p className="mt-1 font-sans text-xs sm:text-sm text-reel">
                  Program tayang reguler di Layar Utama dan Layar Studio
                </p>
              </div>

              <Link
                href="/films"
                className="font-mono text-xs sm:text-sm text-ink hover:text-reel transition-colors underline underline-offset-4"
              >
                Lihat Semua Film
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nowShowing.map((film) => (
                <article
                  key={film.id}
                  className="flex flex-col border border-line bg-paper-card p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-ink rounded-none border border-line/60">
                    <Image
                      src={film.posterUrl}
                      alt={film.title}
                      width={360}
                      height={480}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-ink/75">
                        <span className="border border-line bg-transparent px-2 py-0.5 tracking-tight">
                          {film.category === "DOCUMENTARY"
                            ? "Dokumenter"
                            : film.category === "SHORT"
                            ? "Film Pendek"
                            : "Film Panjang"}
                        </span>
                        <span className="text-reel font-mono">{film.durationMinutes} Min</span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                        <Link href={`/films/${film.slug || film.id}`} className="hover:opacity-80 transition-opacity">
                          {film.title}
                        </Link>
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-reel font-sans">
                        {film.synopsis}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-line pt-3.5">
                      <div className="font-mono text-xs font-bold text-ink">
                        <span>Rp {film.price.toLocaleString("id-ID")}</span>
                        <span className="text-[10px] text-reel font-normal font-sans ml-1">/ tiket</span>
                      </div>

                      <Link
                        href={`/films/${film.slug || film.id}`}
                        className="rounded-md border border-line bg-paper px-3 py-1.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                      >
                        Jadwal & Tiket
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <div className="border-b border-line pb-4">
                <h2 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl md:text-4xl">
                  Segera Hadir
                </h2>
                <p className="mt-1 font-sans text-xs sm:text-sm text-reel">
                  Program khusus dan rilisan terbatas bulan depan
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {comingSoon.map((film) => (
                  <div
                    key={film.id}
                    className="flex flex-col sm:flex-row gap-5 sm:gap-6 border border-line bg-paper-card p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] dark:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)]"
                  >
                    <div className="aspect-[2/3] w-32 sm:w-36 flex-shrink-0 overflow-hidden bg-ink rounded-none border border-line/60 mx-auto sm:mx-0">
                      <Image
                        src={film.posterUrl}
                        alt={film.title}
                        width={160}
                        height={240}
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="border border-line bg-transparent px-2 py-0.5 text-[11px] font-mono text-reel uppercase tracking-tight">
                          Rilisan Mendatang
                        </span>
                        <h3 className="mt-2 font-display text-xl sm:text-2xl font-bold text-ink">
                          {film.title}
                        </h3>
                        <p className="mt-1 font-mono text-xs text-reel">
                          Sutradara: {film.director}
                        </p>
                        <p className="mt-2.5 text-sm leading-relaxed text-reel font-sans">
                          {film.synopsis}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
