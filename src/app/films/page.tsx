import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";

export const revalidate = 60;

export default async function FilmsPage() {
  const films = await prisma.film.findMany({
    include: {
      showtimes: {
        orderBy: { startTime: "asc" },
      },
    },
    orderBy: [{ isNowShowing: "desc" }, { createdAt: "desc" }],
  });

  const nowShowing = films.filter((f) => f.isNowShowing);
  const comingSoon = films.filter((f) => f.isComingSoon);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="border-b border-line pb-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D99DE]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1D99DE]">
                Program Sinema
              </span>
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              Katalog Film & Jadwal
            </h1>
            <p className="mt-2 max-w-xl text-sm text-reel">
              Setiap film dikurasi khusus untuk diputar di auditorium 24 kursi.
              Pilih film untuk melihat sinopsis lengkap dan memesan kursi.
            </p>
          </div>

          {/* Now Showing Section */}
          <section className="mt-12">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-display text-2xl font-bold text-ink">
                Sedang Tayang
              </h2>
              <span className="font-mono text-xs font-semibold text-[#F49924]">
                {nowShowing.length} Judul Film
              </span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {nowShowing.map((film) => (
                <article
                  key={film.id}
                  className="flex flex-col border border-line bg-white shadow-warm transition-shadow hover:shadow-warm-lg"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-ink">
                    <img
                      src={film.posterUrl}
                      alt={film.title}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 bg-[#F49924] px-2.5 py-0.5 font-mono text-xs font-bold tracking-wider text-white shadow-sm">
                      SEDANG TAYANG
                    </div>
                  </div>

                    <div className="flex flex-1 flex-col justify-between p-6">
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2 py-0.5 font-semibold text-[#1277B0]">
                            {film.genre}
                          </span>
                          <span className="text-reel">{film.durationMinutes} Menit</span>
                        </div>

                        <h3 className="mt-2.5 font-display text-3xl font-bold text-ink">
                          {film.title}
                        </h3>

                        {film.originalTitle && (
                          <p className="text-xs italic text-reel">
                            {film.originalTitle} ({film.releaseYear})
                          </p>
                        )}

                        <p className="mt-3 text-sm leading-relaxed text-reel">
                          {film.synopsis}
                        </p>
                      </div>

                      <div className="mt-6 border-t border-line pt-4">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <span className="block font-mono text-xs text-reel">
                              Tiket Masuk
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-ink">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                              <span>Rp {film.price.toLocaleString("id-ID")}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Link
                              href={`/films/${film.id}`}
                              className="border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink transition-colors hover:border-[#1D99DE] hover:text-[#1D99DE]"
                            >
                              Detail Film
                            </Link>

                            {film.showtimes.length > 0 && (
                              <Link
                                href={`/book/${film.showtimes[0].id}`}
                                className="bg-[#D21871] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#B4115F]"
                              >
                                Pesan Tiket
                              </Link>
                            )}
                          </div>
                        </div>

                        {/* Showtimes badges */}
                        {film.showtimes.length > 0 && (
                          <div className="mt-4 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs text-reel">
                              Jadwal:
                            </span>
                            {film.showtimes.map((st) => (
                              <Link
                                key={st.id}
                                href={`/book/${st.id}`}
                                className="border border-line bg-[#FAF8F5] px-2.5 py-0.5 font-mono text-xs font-semibold text-ink transition-colors hover:border-[#1D99DE] hover:bg-[#1D99DE] hover:text-white"
                              >
                                {new Date(st.startTime).toLocaleTimeString(
                                  "id-ID",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          </section>

          {/* Coming Soon Section */}
          {comingSoon.length > 0 && (
            <section className="mt-16 border-t border-line pt-12">
              <div className="border-b border-line pb-3">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Segera Hadir
                </h2>
                <p className="mt-1 text-xs text-reel">
                  Rilisan eksklusif dan film retrospektif mendatang
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {comingSoon.map((film) => (
                  <article
                    key={film.id}
                    className="border border-line bg-white p-5 shadow-warm"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden bg-ink">
                      <img
                        src={film.posterUrl}
                        alt={film.title}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                    <div className="mt-4">
                      <span className="border border-[#F49924]/30 bg-[#F49924]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#A6610A]">
                        {film.genre}
                      </span>
                      <h3 className="mt-2.5 font-display text-xl font-bold text-ink">
                        {film.title}
                      </h3>
                      <p className="mt-1 font-mono text-xs text-reel">
                        Sutradara: {film.director}
                      </p>
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-reel">
                        {film.synopsis}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
