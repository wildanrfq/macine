import Link from "next/link";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [totalFilms, totalShowtimes, bookings] = await Promise.all([
    prisma.film.count(),
    prisma.showtime.count(),
    prisma.booking.findMany({
      include: {
        showtime: {
          include: { film: true },
        },
        tickets: true,
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const paidBookings = bookings.filter((b) => b.paymentStatus === "PAID");
  const totalRevenue = paidBookings.reduce((sum, b) => sum + b.totalAmount, 0);
  const totalTicketsSold = paidBookings.reduce(
    (sum, b) => sum + b.tickets.length,
    0
  );

  return (
    <div className="max-w-6xl">
      <div className="border-b border-line pb-4 flex items-center justify-between">
        <div>
          <span className="font-mono text-xs uppercase text-reel">
            Panel Kurator & Manajer
          </span>
          <h1 className="font-display text-3xl font-bold text-ink">
            Ringkasan Operasional
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/films/new"
            className="border border-ink bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-transparent hover:text-ink"
          >
            + Tambah Film
          </Link>
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="border border-line bg-paper p-5">
          <span className="font-mono text-xs text-reel uppercase">
            Total Film Aktif
          </span>
          <p className="mt-2 font-display text-4xl font-bold text-ink">
            {totalFilms}
          </p>
          <span className="mt-1 block text-xs text-reel">
            Now showing & coming soon
          </span>
        </div>

        <div className="border border-line bg-paper p-5">
          <span className="font-mono text-xs text-reel uppercase">
            Jadwal Pemutaran
          </span>
          <p className="mt-2 font-display text-4xl font-bold text-ink">
            {totalShowtimes}
          </p>
          <span className="mt-1 block text-xs text-reel">
            Sesi aktif terdaftar
          </span>
        </div>

        <div className="border border-line bg-paper p-5">
          <span className="font-mono text-xs text-reel uppercase">
            Tiket Terjual
          </span>
          <p className="mt-2 font-display text-4xl font-bold text-ink">
            {totalTicketsSold}
          </p>
          <span className="mt-1 block text-xs text-reel">
            Dari kapasitas 24 kursi / sesi
          </span>
        </div>

        <div className="border border-line bg-paper p-5">
          <span className="font-mono text-xs text-reel uppercase">
            Total Pendapatan
          </span>
          <p className="mt-2 font-mono text-2xl font-bold text-ink">
            Rp {totalRevenue.toLocaleString("id-ID")}
          </p>
          <span className="mt-1 block text-xs text-reel">
            Transaksi terkonfirmasi
          </span>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="mt-12">
        <div className="flex items-center justify-between border-b border-line pb-3">
          <h2 className="font-display text-xl font-bold text-ink">
            Transaksi & Pemesanan Terbaru
          </h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-mono text-reel hover:text-ink"
          >
            Lihat Semua Transaksi
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto border border-line">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line bg-line/20 font-mono text-xs uppercase text-reel">
              <tr>
                <th className="px-4 py-3">Kode Booking</th>
                <th className="px-4 py-3">Pemesan</th>
                <th className="px-4 py-3">Film & Jadwal</th>
                <th className="px-4 py-3">Jumlah Tiket</th>
                <th className="px-4 py-3">Nominal</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {bookings.length > 0 ? (
                bookings.slice(0, 5).map((b) => (
                  <tr key={b.id}>
                    <td className="px-4 py-3 font-mono text-xs">
                      {b.bookingCode}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium text-ink">
                        {b.customerName}
                      </span>
                      <span className="block text-xs text-reel">
                        {b.customerEmail}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-medium">
                        {b.showtime.film.title}
                      </span>
                      <span className="block text-xs text-reel">
                        {new Date(b.showtime.startTime).toLocaleTimeString(
                          "id-ID",
                          { hour: "2-digit", minute: "2-digit" }
                        )}{" "}
                        WIB
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {b.tickets.length} Tiket
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      Rp {b.totalAmount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="border border-line px-2 py-0.5 font-mono text-xs uppercase">
                        {b.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-xs text-reel">
                    Belum ada transaksi pemesanan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
