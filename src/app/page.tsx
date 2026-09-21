import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { getCachedFilms } from "@/lib/films";

export const revalidate = 60;

export default async function HomePage() {
  const films = await getCachedFilms();

  const featuredFilm = films.find((f) => f.isNowShowing) || films[0];
  const otherFilms = films.filter((f) => f.id !== featuredFilm?.id);
  const nowShowing = otherFilms.filter((f) => f.isNowShowing);
  const comingSoon = films.filter((f) => f.isComingSoon);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1">
        {/* Asymmetric Poster-forward Marquee Hero with Warm White Base & Color Accents */}
        {featuredFilm && (
          <section className="relative overflow-hidden border-b border-line py-10 sm:py-16 md:py-24">
            {/* Ambient cinema glows in brand colors */}
            <div className="pointer-events-none absolute -top-24 -left-20 h-96 w-96 rounded-full bg-[#1D99DE]/10 blur-[110px] ambient-cinema-glow" />
            <div className="pointer-events-none absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#F49924]/12 blur-[120px] ambient-cinema-glow" />
            <div className="pointer-events-none absolute -bottom-20 left-1/3 h-80 w-80 rounded-full bg-[#D21871]/10 blur-[100px] ambient-cinema-glow" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
              <div className="grid grid-cols-1 items-center gap-8 lg:gap-12 lg:grid-cols-12">
                {/* Poster column */}
                <div className="lg:col-span-5 flex justify-center lg:justify-start">
                  <div className="relative aspect-[2/3] w-full max-w-[280px] sm:max-w-sm overflow-hidden border border-line bg-white p-2.5 shadow-warm-lg">
                    <div className="relative h-full w-full overflow-hidden bg-[#121110]">
                      <Image
                        src={featuredFilm.posterUrl}
                        alt={featuredFilm.title}
                        width={400}
                        height={600}
                        priority
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#F49924] px-3 py-1 font-mono text-xs font-bold tracking-wider text-white shadow-sm">
                        SEDANG TAYANG
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details column */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D21871]" />
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D21871]">
                      Pilihan Kurator Pekan Ini
                    </span>
                  </div>

                  <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-7xl break-words">
                    {featuredFilm.title}
                  </h1>

                  {featuredFilm.originalTitle && (
                    <p className="mt-1 text-base sm:text-lg italic text-reel">
                      {featuredFilm.originalTitle} ({featuredFilm.releaseYear})
                    </p>
                  )}

                  <div className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2 text-xs font-mono">
                    <span className="border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2.5 py-1 font-semibold text-[#1277B0]">
                      {featuredFilm.genre}
                    </span>
                    <span className="border border-[#F49924]/30 bg-[#F49924]/10 px-2.5 py-1 font-semibold text-[#A6610A]">
                      {featuredFilm.durationMinutes} Menit
                    </span>
                    <span className="border border-[#D21871]/30 bg-[#D21871]/10 px-2.5 py-1 font-semibold text-[#D21871]">
                      Klasifikasi {featuredFilm.rating}
                    </span>
                    <span className="border border-line bg-white px-2.5 py-1 text-reel">
                      Sutradara: {featuredFilm.director}
                    </span>
                  </div>

                  <p className="mt-5 sm:mt-6 max-w-xl text-sm sm:text-base leading-relaxed text-ink/80">
                    {featuredFilm.synopsis}
                  </p>

                  <div className="mt-6 sm:mt-8 border-t border-line/60 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-mono uppercase tracking-wider text-reel">
                        Jadwal Pemutaran Hari Ini
                      </span>
                      <span className="text-xs font-mono font-medium text-[#1D99DE]">
                        Pilih jam untuk pesan
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
                              className="group flex flex-1 sm:flex-initial items-center justify-center gap-2.5 sm:gap-3 border border-line bg-white px-4 py-2.5 text-sm text-ink shadow-sm transition-all hover:border-[#1D99DE] hover:bg-[#1D99DE] hover:text-white"
                            >
                              <span className="font-mono font-bold">{timeStr}</span>
                              <span className="text-xs text-reel group-hover:text-white/90">
                                {st.auditorium}
                              </span>
                            </Link>
                          );
                        })
                      ) : (
                        <p className="text-sm text-reel">
                          Belum ada jadwal tayang hari ini.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                    <Link
                      href={`/films/${featuredFilm.slug || featuredFilm.id}`}
                      className="text-center bg-[#D21871] px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#B4115F] hover:shadow-lg"
                    >
                      Detail Film & Sinopsis
                    </Link>
                    <div className="flex items-center justify-center sm:justify-start gap-2 font-mono text-sm font-bold text-ink">
                      <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                      <span>Rp {featuredFilm.price.toLocaleString("id-ID")}</span>
                      <span className="text-xs font-normal text-reel">/ tiket</span>
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
                <p className="mt-1 text-xs sm:text-sm text-reel">
                  Program tayang reguler di Layar Utama dan Layar Studio
                </p>
              </div>

              <Link
                href="/films"
                className="text-xs sm:text-sm font-semibold text-[#1D99DE] transition-colors hover:text-[#0F6696] hover:underline"
              >
                Lihat Semua Film →
              </Link>
            </div>

            <div className="mt-8 sm:mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {nowShowing.map((film) => (
                <article
                  key={film.id}
                  className="flex flex-col border border-line bg-white p-4 shadow-warm transition-shadow hover:shadow-warm-lg"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-ink">
                    <Image
                      src={film.posterUrl}
                      alt={film.title}
                      width={360}
                      height={480}
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="mt-4 flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2 py-0.5 font-semibold text-[#1277B0]">
                          {film.category === "DOCUMENTARY"
                            ? "Dokumenter"
                            : film.category === "SHORT"
                            ? "Film Pendek"
                            : "Film Panjang"}
                        </span>
                        <span className="text-reel font-semibold">{film.durationMinutes} Min</span>
                      </div>

                      <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                        <Link href={`/films/${film.slug || film.id}`} className="hover:text-[#1D99DE]">
                          {film.title}
                        </Link>
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-reel">
                        {film.synopsis}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                        <span>Rp {film.price.toLocaleString("id-ID")}</span>
                      </div>

                      <Link
                        href={`/films/${film.slug || film.id}`}
                        className="border border-[#1D99DE] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#1D99DE] shadow-sm transition-all hover:bg-[#1D99DE] hover:text-white"
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
                <p className="mt-1 text-xs sm:text-sm text-reel">
                  Program khusus dan rilisan terbatas bulan depan
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                {comingSoon.map((film) => (
                  <div
                    key={film.id}
                    className="flex flex-col sm:flex-row gap-5 sm:gap-6 border border-line bg-white p-5 sm:p-6 shadow-warm"
                  >
                    <div className="aspect-[2/3] w-36 sm:w-40 flex-shrink-0 overflow-hidden bg-ink mx-auto sm:mx-0">
                      <Image
                        src={film.posterUrl}
                        alt={film.title}
                        width={160}
                        height={240}
                        unoptimized
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="flex-1">
                      <span className="border border-[#F49924]/30 bg-[#F49924]/10 px-2 py-0.5 text-xs font-mono font-semibold text-[#A6610A]">
                        Rilisan Mendatang
                      </span>
                      <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                        {film.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-reel">
                        Sutradara: {film.director}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-reel">
                        {film.synopsis}
                      </p>
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
