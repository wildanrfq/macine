import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminFilmsPage() {
  const films = await prisma.film.findMany({
    include: {
      showtimes: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs uppercase text-reel">
            Manajemen Konten
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">
            Katalog & Kurasi Film
          </h1>
        </div>

        <Link
          href="/admin/films/new"
          className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-transparent hover:text-ink"
        >
          + Tambah Judul Baru
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-line/20 font-mono text-xs uppercase text-reel">
            <tr>
              <th className="px-4 py-3">Poster</th>
              <th className="px-4 py-3">Judul Film</th>
              <th className="px-4 py-3">Sutradara</th>
              <th className="px-4 py-3">Durasi</th>
              <th className="px-4 py-3">Harga Tiket</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Sesi Tayang</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {films.map((film) => (
              <tr key={film.id}>
                <td className="px-4 py-3">
                  <div className="aspect-[2/3] w-12 bg-ink">
                    <img
                      src={film.posterUrl}
                      alt={film.title}
                      className="h-full w-full object-cover grayscale"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{film.title}</div>
                  {film.originalTitle && (
                    <div className="text-xs italic text-reel">
                      {film.originalTitle}
                    </div>
                  )}
                  <div className="font-mono text-xs text-reel">
                    {film.genre} ({film.releaseYear})
                  </div>
                </td>
                <td className="px-4 py-3 text-xs">{film.director}</td>
                <td className="px-4 py-3 font-mono text-xs">
                  {film.durationMinutes} Min
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  Rp {film.price.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3">
                  {film.isNowShowing ? (
                    <span className="border border-ink bg-ink px-2 py-0.5 font-mono text-[10px] text-paper">
                      SEDANG TAYANG
                    </span>
                  ) : (
                    <span className="border border-line px-2 py-0.5 font-mono text-[10px] text-reel">
                      SEGERA HADIR
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {film.showtimes.length} Sesi
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/films/${film.id}`}
                      target="_blank"
                      className="text-xs text-reel underline hover:text-ink"
                    >
                      Lihat
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
