import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminSchedulesPage() {
  const showtimes = await prisma.showtime.findMany({
    include: {
      film: true,
      tickets: true,
    },
    orderBy: { startTime: "asc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between border-b border-line pb-4">
        <div>
          <span className="font-mono text-xs uppercase text-reel">
            Pengaturan Sesi
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">
            Jadwal Pemutaran
          </h1>
        </div>

        <button
          type="button"
          className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-transparent hover:text-ink"
        >
          + Jadwalkan Sesi Baru
        </button>
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-line/20 font-mono text-xs uppercase text-reel">
            <tr>
              <th className="px-4 py-3">Hari & Tanggal</th>
              <th className="px-4 py-3">Pukul</th>
              <th className="px-4 py-3">Film</th>
              <th className="px-4 py-3">Studio</th>
              <th className="px-4 py-3">Harga</th>
              <th className="px-4 py-3">Okupansi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {showtimes.map((st) => {
              const date = new Date(st.startTime);
              const dateStr = date.toLocaleDateString("id-ID", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const timeStr = date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <tr key={st.id}>
                  <td className="px-4 py-3 font-medium">{dateStr}</td>
                  <td className="px-4 py-3 font-mono font-bold text-ink">
                    {timeStr} WIB
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{st.film.title}</div>
                    <div className="text-xs text-reel font-mono">
                      {st.film.durationMinutes} Min
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    {st.auditorium}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">
                    Rp {(st.priceOverride ?? st.film.price).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">
                      {st.tickets.length} / {st.capacity} Tiket
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
