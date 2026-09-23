import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import { getFilmPalette } from "@/lib/film-palettes";

export const revalidate = 60;

interface FilmDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const films = await prisma.film.findMany({ select: { slug: true } });
    return films.map((f) => ({ slug: f.slug }));
  } catch {
    return [];
  }
}

export default async function FilmDetailPage({ params }: FilmDetailPageProps) {
  const { slug } = await params;

  const film = await prisma.film.findFirst({
    where: {
      OR: [{ slug }, { id: slug }],
    },
    include: {
      showtimes: {
        orderBy: { startTime: "asc" },
      },
    },
  });

  if (!film) {
    notFound();
  }

  const palette = getFilmPalette(film.slug || film.id);

  const categoryLabel =
    film.category === "DOCUMENTARY"
      ? "Film Dokumenter"
      : film.category === "SHORT"
      ? "Film Pendek"
      : "Film Panjang";

  const programLabel =
    film.category === "DOCUMENTARY"
      ? "Rekam Jejak"
      : film.category === "SHORT"
      ? "Kisah Singkat"
      : "Sinema Sorot";

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            href="/films"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-ink hover:text-reel underline underline-offset-4 transition-colors"
          >
            Kembali ke Daftar Film
          </Link>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">
            {/* Poster Column */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-stretch">
              <div className="border border-line bg-paper-card p-2 sm:p-2.5 shadow-[4px_4px_0px_0px_rgba(18,17,16,0.12)] dark:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] w-full max-w-[280px] sm:max-w-sm lg:max-w-none mx-auto lg:mx-0 rounded-none">
                <div className="aspect-[2/3] w-full overflow-hidden bg-ink rounded-none">
                  <Image
                    src={film.posterUrl}
                    alt={film.title}
                    width={400}
                    height={600}
                    priority
                    unoptimized
                    className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                  />
                </div>
              </div>

              {/* Program Information (Desktop sidebar) */}
              <div className="hidden lg:block mt-6 border border-line bg-paper-card p-5 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.06)]">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: palette.accent }}
                  />
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-reel">
                    Informasi Program
                  </h3>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Program Kurasi</dt>
                    <dd className="font-bold text-ink mt-0.5">
                      {programLabel} Vol. {film.programVol}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Kategori</dt>
                    <dd className="font-medium text-ink mt-1">
                      <span className="inline-block border border-line bg-transparent px-2 py-0.5 font-mono text-xs text-ink/80">
                        {categoryLabel}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Sutradara</dt>
                    <dd className="font-medium text-ink mt-0.5">{film.director}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Durasi</dt>
                    <dd className="font-mono text-sm text-ink mt-0.5">
                      {film.durationMinutes} Menit
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Klasifikasi Usia</dt>
                    <dd className="font-medium text-ink mt-1">
                      <span className="inline-block border border-line bg-transparent px-2 py-0.5 font-mono text-xs text-ink/80">
                        {film.rating}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Genre</dt>
                    <dd className="font-medium text-ink mt-0.5">
                      {film.genre}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Tahun Rilis</dt>
                    <dd className="font-mono text-sm text-ink mt-0.5">{film.releaseYear}</dd>
                  </div>
                  <div className="border-t border-line pt-3">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Tarif Tiket</dt>
                    <dd className="flex items-center gap-1 font-mono font-bold text-ink mt-0.5">
                      <span>Rp {film.price.toLocaleString("id-ID")}</span>
                      <span className="text-xs font-normal text-reel">/ kursi</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Synopsis & Showtimes Column */}
            <div className="lg:col-span-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="border border-line bg-transparent px-2.5 py-0.5 font-mono text-xs font-semibold uppercase tracking-tight text-ink/80">
                    {film.isNowShowing ? "Sedang Tayang" : "Segera Hadir"}
                  </span>
                  <span className="border border-line bg-transparent px-2.5 py-0.5 font-mono text-xs text-reel tracking-tight">
                    Program: {programLabel} Vol. {film.programVol}
                  </span>
                </div>

                <h1 className="mt-2 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink break-words leading-[1.08]">
                  {film.title}
                </h1>

                {film.originalTitle && (
                  <p className="mt-1.5 font-display text-lg sm:text-xl italic text-reel">
                    {film.originalTitle}
                  </p>
                )}
              </div>

              <div className="mt-6 sm:mt-8 border-y border-line py-5 sm:py-6">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  Sinopsis
                </h2>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed text-ink/85 font-sans">
                  {film.synopsis}
                </p>
              </div>

              {/* Showtimes & Booking Selector */}
              <div className="mt-6 sm:mt-8">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  Pilih Jadwal Pemutaran
                </h2>
                <p className="mt-1 text-xs sm:text-sm text-reel font-sans">
                  Auditorium intim 20–24 kursi. Setiap pemesanan mendapatkan tiket digital resmi dengan QR code.
                </p>

                {film.showtimes.length > 0 ? (
                  <div className="mt-5 sm:mt-6 space-y-3.5">
                    {film.showtimes.map((st) => {
                      const dateStr = new Date(st.startTime).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      );
                      const timeStr = new Date(st.startTime).toLocaleTimeString(
                        "id-ID",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      );
                      const effectivePrice = st.priceOverride ?? film.price;

                      return (
                        <div
                          key={st.id}
                          className="flex flex-col justify-between rounded-xs border border-line bg-paper-card p-4 sm:p-5 shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)] transition-all hover:border-ink/50 sm:flex-row sm:items-center gap-4"
                          style={{
                            borderLeftWidth: "3px",
                            borderLeftColor: palette.accent,
                          }}
                        >
                          <div>
                            <div className="flex items-center gap-2.5 sm:gap-3">
                              <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-ink">
                                {timeStr}
                              </span>
                              <span className="border-l border-line/70 pl-2.5 font-mono text-[11px] uppercase tracking-wider text-reel">
                                {st.auditorium}
                              </span>
                            </div>
                            <p className="mt-1 text-xs font-mono text-reel">{dateStr}</p>
                          </div>

                          <div className="flex items-center justify-between gap-4 sm:gap-6 border-t border-line/60 pt-3 sm:border-t-0 sm:pt-0">
                            <div className="font-mono text-sm font-bold text-ink">
                              <span>Rp {effectivePrice.toLocaleString("id-ID")}</span>
                              <span className="text-[11px] text-reel font-normal font-sans ml-1">/ kursi</span>
                            </div>

                            <Link
                              href={`/book/${st.id}`}
                              className="rounded-md px-5 py-2 font-mono text-xs font-medium uppercase tracking-wider shadow-xs transition-opacity hover:opacity-90"
                              style={{
                                backgroundColor: palette.accent,
                                color: palette.accentText,
                              }}
                            >
                              Pesan Tiket
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 border border-dashed border-line bg-paper-card p-8 text-center shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
                    <p className="text-sm font-mono text-reel">
                      Jadwal pemutaran untuk film ini belum dibuka. Silakan periksa kembali jadwal pekan ini.
                    </p>
                  </div>
                )}
              </div>

              {/* Program Information (Mobile placement after showtimes) */}
              <div className="block lg:hidden mt-8 border border-line bg-paper-card p-5 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.06)]">
                <div className="flex items-center gap-2">
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: palette.accent }}
                  />
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-reel">
                    Informasi Program Film
                  </h3>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Program Kurasi</dt>
                    <dd className="font-bold text-ink text-xs sm:text-sm">
                      {programLabel} Vol. {film.programVol}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Kategori</dt>
                    <dd className="font-medium text-ink">
                      <span className="inline-block border border-line bg-transparent px-2 py-0.5 font-mono text-xs text-ink/80">
                        {categoryLabel}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Sutradara</dt>
                    <dd className="font-medium text-ink text-xs sm:text-sm">{film.director}</dd>
                  </div>
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Durasi</dt>
                    <dd className="font-mono text-xs sm:text-sm text-ink">
                      {film.durationMinutes} Menit
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Klasifikasi Usia</dt>
                    <dd className="font-medium text-ink">
                      <span className="inline-block border border-line bg-transparent px-2 py-0.5 font-mono text-xs text-ink/80">
                        {film.rating}
                      </span>
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Genre</dt>
                    <dd className="font-medium text-ink text-xs sm:text-sm">
                      {film.genre}
                    </dd>
                  </div>
                  <div className="flex justify-between border-b border-line/50 pb-2">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Tahun Rilis</dt>
                    <dd className="font-mono text-xs sm:text-sm text-ink">{film.releaseYear}</dd>
                  </div>
                  <div className="flex justify-between pt-1">
                    <dt className="text-xs text-reel font-mono uppercase tracking-tight">Tarif Tiket</dt>
                    <dd className="flex items-center gap-1 font-mono font-bold text-ink text-xs sm:text-sm">
                      <span>Rp {film.price.toLocaleString("id-ID")}</span>
                      <span className="text-[10px] text-reel font-normal font-sans">/ kursi</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
