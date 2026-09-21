import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";

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

      <main className="flex-1 py-12">
        <div className="mx-auto max-w-5xl px-6">
          <Link
            href="/films"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1D99DE] transition-colors hover:text-[#0F6696]"
          >
            ← Kembali ke Daftar Film
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Poster Column */}
            <div className="lg:col-span-4">
              <div className="border border-line bg-white p-2.5 shadow-warm">
                <div className="aspect-[2/3] w-full overflow-hidden bg-ink">
                  <img
                    src={film.posterUrl}
                    alt={film.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-6 border border-line bg-white p-5 shadow-warm">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                  <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-reel">
                    Informasi Program
                  </h3>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-reel">Program Kurasi</dt>
                    <dd className="font-bold text-ink">
                      {programLabel} Vol. {film.programVol}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel">Kategori</dt>
                    <dd className="font-medium text-ink">
                      <span className="inline-block border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#1277B0]">
                        {categoryLabel}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel">Sutradara</dt>
                    <dd className="font-medium text-ink">{film.director}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel">Durasi</dt>
                    <dd className="font-medium text-ink">
                      {film.durationMinutes} Menit
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel">Klasifikasi Usia</dt>
                    <dd className="font-medium text-ink">
                      <span className="inline-block border border-[#D21871]/30 bg-[#D21871]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#D21871]">
                        {film.rating}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel">Genre</dt>
                    <dd className="font-medium text-ink">
                      {film.genre}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-reel">Tahun Rilis</dt>
                    <dd className="font-medium text-ink">{film.releaseYear}</dd>
                  </div>
                  <div className="border-t border-line pt-3">
                    <dt className="text-xs text-reel">Harga Tiket</dt>
                    <dd className="flex items-center gap-1.5 font-mono font-bold text-ink">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                      <span>Rp {film.price.toLocaleString("id-ID")}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Synopsis & Showtimes Column */}
            <div className="lg:col-span-8">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="border border-[#F49924]/30 bg-[#F49924]/10 px-2.5 py-0.5 font-mono text-xs font-bold uppercase tracking-wider text-[#A6610A]">
                    {film.isNowShowing ? "Sedang Tayang" : "Segera Hadir"}
                  </span>
                  <span className="border border-line bg-paper px-2.5 py-0.5 font-mono text-xs text-reel">
                    Program: {programLabel} Vol. {film.programVol}
                  </span>
                </div>

                <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {film.title}
                </h1>

                {film.originalTitle && (
                  <p className="mt-1 font-display text-xl italic text-reel">
                    {film.originalTitle}
                  </p>
                )}
              </div>

              <div className="mt-8 border-y border-line py-6">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Sinopsis
                </h2>
                <p className="mt-4 text-base leading-relaxed text-ink/80">
                  {film.synopsis}
                </p>
              </div>

              {/* Showtimes & Booking Selector */}
              <div className="mt-8">
                <h2 className="font-display text-2xl font-bold text-ink">
                  Pilih Jadwal Pemutaran
                </h2>
                <p className="mt-1 text-sm text-reel">
                  Auditorium intim 20–24 kursi. Setiap pemesanan mendapatkan tiket digital resmi dengan QR code.
                </p>

                {film.showtimes.length > 0 ? (
                  <div className="mt-6 space-y-4">
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
                          className="flex flex-col justify-between border border-line bg-white p-5 shadow-warm transition-all hover:border-[#1D99DE] sm:flex-row sm:items-center"
                        >
                          <div>
                            <div className="flex items-center gap-3">
                              <span className="font-display text-3xl font-bold text-ink">
                                {timeStr}
                              </span>
                              <span className="border border-line bg-[#FAF8F5] px-2 py-0.5 font-mono text-xs text-reel">
                                {st.auditorium}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-reel">{dateStr}</p>
                          </div>

                          <div className="mt-4 flex items-center justify-between gap-6 sm:mt-0">
                            <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-ink">
                              <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                              <span>Rp {effectivePrice.toLocaleString("id-ID")}</span>
                            </div>

                            <Link
                              href={`/book/${st.id}`}
                              className="bg-[#D21871] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#B4115F]"
                            >
                              Pesan Tiket
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-6 border border-dashed border-line bg-white p-8 text-center shadow-warm">
                    <p className="text-sm text-reel">
                      Jadwal pemutaran untuk film ini belum dibuka. Silakan periksa kembali jadwal pekan ini.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
