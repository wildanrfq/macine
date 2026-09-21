import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    include: {
      showtime: {
        include: { film: true },
      },
      tickets: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="border-b border-line pb-4">
        <span className="font-mono text-xs uppercase text-reel">
          Log Transaksi
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">
          Pemesanan & Status Tiket
        </h1>
      </div>

      <div className="mt-8 overflow-x-auto border border-line">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-line bg-line/20 font-mono text-xs uppercase text-reel">
            <tr>
              <th className="px-4 py-3">Kode Booking</th>
              <th className="px-4 py-3">Pemesan</th>
              <th className="px-4 py-3">Film</th>
              <th className="px-4 py-3">Jadwal Tayang</th>
              <th className="px-4 py-3">Jumlah Tiket</th>
              <th className="px-4 py-3">Total Tagihan</th>
              <th className="px-4 py-3">Metode & Ref</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {bookings.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-mono text-xs font-bold">
                  {b.bookingCode}
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-ink">{b.customerName}</div>
                  <div className="text-xs text-reel">{b.customerEmail}</div>
                  <div className="font-mono text-xs text-reel">
                    {b.customerPhone}
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">
                  {b.showtime.film.title}
                </td>
                <td className="px-4 py-3 text-xs">
                  <div>
                    {new Date(b.showtime.startTime).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                  <div className="font-mono text-reel">
                    {new Date(b.showtime.startTime).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    WIB
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {b.ticketCount} Tiket (Free-Seating)
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  Rp {b.totalAmount.toLocaleString("id-ID")}
                </td>
                <td className="px-4 py-3 text-xs">
                  <div className="font-mono font-semibold">
                    {b.paymentMethod || "QRIS"}
                  </div>
                  <div className="font-mono text-[10px] text-reel">
                    {b.paymentGatewayRef || "Pending Ref"}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`border px-2 py-0.5 font-mono text-[10px] ${
                      b.paymentStatus === "PAID"
                        ? "border-ink bg-ink text-paper font-bold"
                        : "border-line text-reel"
                    }`}
                  >
                    {b.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
