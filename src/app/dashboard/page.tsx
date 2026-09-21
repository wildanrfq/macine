import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import QrCodeVisual from "@/components/ui/QrCodeVisual";
import { getCurrentUser } from "@/lib/auth";
import { expireOverdueBookings } from "@/lib/payment";

export const dynamic = "force-dynamic";

interface DashboardPageProps {
  searchParams?: Promise<{ code?: string; search?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  await expireOverdueBookings();

  const user = await getCurrentUser();
  const sp = searchParams ? await searchParams : {};
  const queryCode = sp.code?.trim() || sp.search?.trim();

  let bookings: Array<{
    id: string;
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    ticketCount: number;
    totalAmount: number;
    paymentStatus: string;
    createdAt: Date;
    expiresAt?: Date | null;
    qrisString?: string | null;
    showtime: {
      startTime: Date;
      auditorium: string;
      film: {
        id: string;
        title: string;
        posterUrl: string;
        slug?: string;
      };
    };
    tickets: Array<{
      ticketCode: string;
    }>;
  }> = [];

  if (user) {
    bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { userId: user.id },
          { customerEmail: user.email.toLowerCase() },
        ],
      },
      include: {
        showtime: {
          include: { film: true },
        },
        tickets: true,
      },
      orderBy: { createdAt: "desc" },
    });
  } else if (queryCode) {
    bookings = await prisma.booking.findMany({
      where: {
        OR: [
          { bookingCode: queryCode },
          { customerEmail: queryCode.toLowerCase() },
        ],
      },
      include: {
        showtime: {
          include: { film: true },
        },
        tickets: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  const activeBookings = bookings.filter((b) => b.paymentStatus === "PAID");
  const otherBookings = bookings.filter((b) => b.paymentStatus !== "PAID");

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar
        initialUser={
          user
            ? {
                id: user.id,
                name: user.name,
                email: user.email,
              }
            : null
        }
      />

      <main className="flex-1 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Header */}
          <div className="border-b border-line pb-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1D99DE]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1D99DE]">
                Area Penonton
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              {user ? `Tiket Saya, ${user.name.split(" ")[0]}` : "Tiket & Riwayat Pemesanan"}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-reel">
              {user
                ? "Seluruh tiket aktif dan riwayat pemesanan yang tertaut dengan akun Anda."
                : "Tunjukkan tiket digital ini kepada petugas di pintu masuk auditorium sebelum film dimulai."}
            </p>
          </div>

          {/* Not Logged In Banner & Quick Lookup */}
          {!user && (
            <div className="mt-6 sm:mt-8 border border-line bg-white p-5 sm:p-6 shadow-warm">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                      Masuk untuk Menyimpan Riwayat Tiket
                    </h2>
                  </div>
                  <p className="mt-1 max-w-xl text-xs text-reel leading-relaxed">
                    Dengan masuk atau mendaftar akun, seluruh tiket yang Anda pesan akan
                    otomatis tersimpan secara permanen dan siap dipindai kapan saja tanpa perlu mencari email.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <Link
                    href="/login?redirect=/dashboard"
                    className="bg-[#D21871] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#B4115F]"
                  >
                    Masuk Akun
                  </Link>
                  <Link
                    href="/register?redirect=/dashboard"
                    className="border border-[#1D99DE] bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1D99DE] hover:bg-[#1D99DE] hover:text-white"
                  >
                    Daftar Akun
                  </Link>
                </div>
              </div>

              {/* Lookup Form */}
              <div className="mt-6 border-t border-line pt-4">
                <span className="font-mono text-xs text-reel block mb-2">
                  Atau cari tiket manual tanpa login (masukkan Kode Booking / Email):
                </span>
                <form method="GET" action="/dashboard" className="flex flex-col sm:flex-row max-w-md gap-2">
                  <input
                    type="text"
                    name="code"
                    defaultValue={queryCode || ""}
                    placeholder="Contoh: BM-123456-7890 atau email@anda.com"
                    className="flex-1 border border-line bg-[#FAF8F5] px-3.5 py-2 text-xs text-ink focus:border-[#1D99DE] focus:bg-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="border border-ink bg-ink px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white hover:bg-transparent hover:text-ink text-center"
                  >
                    Cari Tiket
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Active Tickets Section */}
          <section className="mt-10 sm:mt-12">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                Tiket Aktif Siap Pindai
              </h2>
              <span className="font-mono text-xs font-semibold text-[#1277B0]">
                {activeBookings.length} Tiket Tersedia
              </span>
            </div>

            {activeBookings.length > 0 ? (
              <div className="mt-6 space-y-6 sm:space-y-8">
                {activeBookings.map((b) => {
                  const showtimeDate = new Date(b.showtime.startTime);
                  const dateStr = showtimeDate.toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  });
                  const timeStr = showtimeDate.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div
                      key={b.id}
                      className="relative overflow-hidden border-2 border-line bg-white text-ink shadow-warm-lg"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12">
                        {/* Main Stub Info */}
                        <div className="p-5 sm:p-8 md:col-span-8">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
                              <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                              <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                              <span className="font-display text-lg sm:text-xl font-bold tracking-wider ml-1 break-words">
                                BIOSKOP MINI CIKINI
                              </span>
                            </div>
                            <span className="self-start sm:self-auto inline-block border border-[#1D99DE] bg-[#1D99DE]/10 px-2.5 py-0.5 font-mono text-xs font-bold uppercase text-[#1277B0]">
                              Lunas / QRIS
                            </span>
                          </div>

                          <div className="mt-5 sm:mt-6">
                            <span className="font-mono text-xs uppercase tracking-wider text-reel">
                              Judul Film
                            </span>
                            <h3 className="mt-1 font-display text-2xl sm:text-4xl font-bold text-ink break-words">
                              {b.showtime.film.title}
                            </h3>
                          </div>

                          <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-4 border-t border-line pt-4 sm:grid-cols-4">
                            <div>
                              <span className="block font-mono text-xs text-reel">
                                Tanggal
                              </span>
                              <span className="font-mono text-xs font-semibold text-ink">
                                {dateStr}
                              </span>
                            </div>
                            <div>
                              <span className="block font-mono text-xs text-reel">
                                Pukul
                              </span>
                              <span className="font-mono text-xs font-bold text-[#A6610A]">
                                {timeStr} WIB
                              </span>
                            </div>
                            <div>
                              <span className="block font-mono text-xs text-reel">
                                Studio
                              </span>
                              <span className="font-mono text-xs font-semibold text-ink">
                                {b.showtime.auditorium}
                              </span>
                            </div>
                            <div>
                              <span className="block font-mono text-xs text-reel">
                                Akses Masuk
                              </span>
                              <span className="font-mono text-base font-bold text-[#D21871]">
                                {b.ticketCount} Tiket
                              </span>
                            </div>
                          </div>

                          <div className="mt-5 sm:mt-6 border-t border-line pt-4 flex flex-col sm:flex-row justify-between gap-1 sm:gap-2 text-xs text-reel">
                            <span>Pemesan: <strong className="text-ink">{b.customerName}</strong></span>
                            <span className="font-mono">
                              Kode Booking: <strong className="text-ink">{b.bookingCode}</strong>
                            </span>
                          </div>
                        </div>

                        {/* Perforated Divider & QR Code Column */}
                        <div className="flex flex-col items-center justify-center border-t border-dashed border-line bg-[#FAF8F5] p-6 sm:p-8 md:border-t-0 md:border-l md:col-span-4">
                          <div className="border border-line p-2 bg-white shadow-sm">
                            <QrCodeVisual
                              value={`PASS-${b.bookingCode}`}
                              size={130}
                              darkColor="#121110"
                              lightColor="#FFFFFF"
                            />
                          </div>

                          <span className="mt-4 font-mono text-xs font-bold tracking-wider text-ink">
                            PINDAI DI PINTU
                          </span>
                          <span className="mt-1 font-mono text-[10px] text-reel">
                            PASS-{b.bookingCode}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-6 border border-dashed border-line bg-white p-10 text-center shadow-warm">
                <p className="text-sm text-reel">
                  {user
                    ? "Anda belum memiliki tiket aktif. Pilih film untuk memesan."
                    : queryCode
                    ? `Tidak ditemukan tiket aktif untuk pencarian "${queryCode}".`
                    : "Belum ada tiket aktif yang dipilih. Masuk ke akun Anda atau cari dengan kode booking."}
                </p>
                <Link
                  href="/films"
                  className="mt-4 inline-block bg-[#D21871] px-5 py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#B4115F]"
                >
                  Jelajahi Film & Pesan
                </Link>
              </div>
            )}
          </section>

          {/* Past / Inactive Bookings */}
          {otherBookings.length > 0 && (
            <section className="mt-16 border-t border-line pt-8">
              <h2 className="font-display text-xl font-bold text-ink">
                Riwayat Transaksi Lainnya
              </h2>

              <div className="mt-4 overflow-x-auto border border-line bg-white shadow-warm">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-line bg-[#FAF8F5] font-mono text-xs uppercase text-reel">
                    <tr>
                      <th className="px-4 py-3">Kode Booking</th>
                      <th className="px-4 py-3">Film</th>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Jumlah</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {otherBookings.map((b) => {
                      const isPending = b.paymentStatus === "PENDING";
                      const isExpired =
                        b.paymentStatus === "EXPIRED" ||
                        b.paymentStatus === "FAILED" ||
                        b.paymentStatus === "GAGAL";

                      return (
                        <tr key={b.id} className="hover:bg-[#FAF8F5]/50">
                          <td className="px-4 py-3 font-mono text-xs">
                            {isPending ? (
                              <Link
                                href={`/pay/${b.bookingCode}`}
                                className="font-bold text-[#1D99DE] hover:underline"
                                title="Lanjutkan pembayaran QRIS"
                              >
                                {b.bookingCode}
                              </Link>
                            ) : (
                              b.bookingCode
                            )}
                          </td>
                          <td className="px-4 py-3 font-medium text-ink">
                            {b.showtime.film.title}
                          </td>
                          <td className="px-4 py-3 text-xs text-reel">
                            {new Date(b.showtime.startTime).toLocaleString(
                              "id-ID"
                            )}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {b.ticketCount} Tiket
                          </td>
                          <td className="px-4 py-3 font-mono text-xs font-bold text-ink">
                            Rp {b.totalAmount.toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-3">
                            {isPending ? (
                              <span className="inline-flex items-center gap-1.5 border border-[#F49924]/40 bg-[#F49924]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#A6610A]">
                                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F49924]" />
                                PENDING
                              </span>
                            ) : isExpired ? (
                              <span className="inline-flex items-center gap-1 border border-[#D21871]/40 bg-[#D21871]/10 px-2 py-0.5 font-mono text-xs font-bold text-[#D21871]">
                                GAGAL
                              </span>
                            ) : (
                              <span className="border border-line px-2 py-0.5 font-mono text-xs text-reel">
                                {b.paymentStatus}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-xs">
                            {isPending ? (
                              <Link
                                href={`/pay/${b.bookingCode}`}
                                className="inline-block bg-[#D21871] px-3 py-1 font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:bg-[#B4115F]"
                              >
                                Bayar Sekarang →
                              </Link>
                            ) : isExpired ? (
                              <Link
                                href={`/films/${b.showtime.film.slug || b.showtime.film.id}`}
                                className="font-semibold text-[#1D99DE] hover:underline"
                              >
                                Pesan Ulang
                              </Link>
                            ) : (
                              <span className="text-reel">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
