import Link from "next/link";
import Image from "next/image";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            Daftar Film
          </h1>
          <p className="mt-1 text-sm text-reel">
            Kelola film yang tayang dan akan datang di Bioskop Mini.
          </p>
        </div>
        <Link
          href="/admin/films/new"
          className="bg-ink px-4 py-2 font-mono text-xs uppercase tracking-wider text-paper hover:bg-lead"
        >
          + Tambah Film
        </Link>
      </div>

      <div className="mt-8 border border-line bg-paper">
        <table className="w-full text-left font-mono text-xs">
          <thead className="border-b border-line bg-line/30 text-reel">
            <tr>
              <th className="px-4 py-3">Poster</th>
              <th className="px-4 py-3">Judul</th>
              <th className="px-4 py-3">Genre</th>
              <th className="px-4 py-3">Durasi</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Jadwal</th>
              <th className="px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {films.map((film) => (
              <tr key={film.id}>
                <td className="px-4 py-3">
                  <div className="aspect-[2/3] w-12 bg-ink">
                    <Image
                      src={film.posterUrl}
                      alt={film.title}
                      width={48}
                      height={72}
                      unoptimized
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
                      href={`/films/${film.slug || film.id}`}
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
