"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import QrCodeVisual from "@/components/ui/QrCodeVisual";

interface PayClientProps {
  initialBooking: {
    id: string;
    bookingCode: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    ticketCount: number;
    totalAmount: number;
    paymentStatus: string;
    qrisString: string | null;
    expiresAt: string | null;
    filmTitle: string;
    filmId: string;
    posterUrl: string;
    auditorium: string;
    startTime: string;
    ticketCodes?: string[];
  };
}

export default function PayClient({ initialBooking }: PayClientProps) {
  const router = useRouter();
  const [booking, setBooking] = useState(initialBooking);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const bookingCode = booking.bookingCode;
  const isPending = booking.paymentStatus === "PENDING";
  const isPaid = booking.paymentStatus === "PAID";
  const isExpired =
    booking.paymentStatus === "EXPIRED" ||
    booking.paymentStatus === "FAILED" ||
    booking.paymentStatus === "GAGAL";

  const checkStatus = useCallback(async () => {
    if (!bookingCode || booking.paymentStatus !== "PENDING") return;

    setIsChecking(true);
    try {
      const res = await fetch(`/api/bookings/${bookingCode}/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.paymentStatus === "PAID") {
          setBooking((prev) => ({
            ...prev,
            paymentStatus: "PAID",
            ticketCodes: data.tickets?.map((t: { ticketCode: string }) => t.ticketCode) || [],
          }));
        } else if (data.paymentStatus === "EXPIRED") {
          setBooking((prev) => ({ ...prev, paymentStatus: "EXPIRED" }));
        }
      }
    } catch (err) {
      console.error("Status polling error", err);
    } finally {
      setIsChecking(false);
    }
  }, [bookingCode, booking.paymentStatus]);

  useEffect(() => {
    if (!isPending) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 2500);

    return () => clearInterval(interval);
  }, [isPending, checkStatus]);

  useEffect(() => {
    if (!isPending || !booking.expiresAt) return;

    const targetTime = new Date(booking.expiresAt).getTime();

    const updateTimer = () => {
      const distance = targetTime - Date.now();

      if (distance <= 0) {
        setTimeLeft("00:00");
        setBooking((prev) => ({ ...prev, paymentStatus: "EXPIRED" }));
        checkStatus();
        return;
      }

      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${minutes.toString().padStart(2, "0")}:${seconds
          .toString()
          .padStart(2, "0")}`
      );
    };

    updateTimer();
    const timerInterval = setInterval(updateTimer, 1000);
    return () => clearInterval(timerInterval);
  }, [isPending, booking.expiresAt, checkStatus]);

  const triggerSimulation = async (status: "settlement" | "expire") => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          status,
        }),
      });

      if (res.ok) {
        await checkStatus();
      }
    } catch (err) {
      console.error("Simulation failed", err);
    } finally {
      setIsSimulating(false);
    }
  };

  const showtimeDate = new Date(booking.startTime);
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
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb / Back */}
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1D99DE] hover:text-[#0F6696]"
        >
          ← Kembali ke Dashboard Penonton
        </Link>
      </div>

      {/* STATE 1: PENDING PAYMENT */}
      {isPending && (
        <div>
          {/* Header */}
          <div className="flex flex-col justify-between border-b border-line pb-4 sm:flex-row sm:items-center">
            <div>
              <span className="font-mono text-xs uppercase text-reel">
                Kode Pemesanan: {booking.bookingCode}
              </span>
              <h1 className="mt-1 font-display text-3xl font-bold text-ink">
                Selesaikan Pembayaran QRIS
              </h1>
            </div>
            <div className="mt-3 text-left font-mono sm:mt-0 sm:text-right">
              <span className="block text-[10px] uppercase text-reel">
                Sisa Waktu Pembayaran
              </span>
              <span className="inline-block border border-[#F49924]/40 bg-[#F49924]/10 px-3 py-1 text-lg font-bold text-[#A6610A]">
                {timeLeft || "15:00"}
              </span>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-12">
            {/* QR Code Presentation */}
            <div className="flex flex-col items-center border border-line bg-white p-6 shadow-warm-lg md:col-span-6">
              <div className="w-full border-b border-line pb-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
                  <span className="font-display text-xl font-bold tracking-widest text-ink">
                    QRIS
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-reel">
                  Standar Pembayaran Nasional
                </p>
              </div>

              <div className="my-6 border-2 border-line bg-white p-3 shadow-inner">
                {booking.qrisString ? (
                  <QrCodeVisual
                    value={booking.qrisString}
                    size={220}
                    darkColor="#121110"
                    lightColor="#FFFFFF"
                  />
                ) : (
                  <div className="flex h-[220px] w-[220px] items-center justify-center bg-paper text-center font-mono text-xs text-reel">
                    Membuat QRIS...
                  </div>
                )}
              </div>

              <div className="w-full text-center">
                <span className="block font-mono text-xs text-reel">
                  Total Pembayaran ({booking.ticketCount} Tiket)
                </span>
                <div className="mt-1 flex items-center justify-center gap-2 font-mono text-2xl font-bold text-ink">
                  <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                  <span>Rp {booking.totalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-reel">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#1D99DE]" />
                <span>Menunggu konfirmasi pembayaran...</span>
              </div>

              <button
                type="button"
                onClick={checkStatus}
                disabled={isChecking}
                className="mt-5 w-full border border-[#1D99DE] bg-[#1D99DE]/5 py-2.5 font-mono text-xs font-semibold text-[#1D99DE] transition-colors hover:bg-[#1D99DE] hover:text-white disabled:opacity-50"
              >
                {isChecking ? "Memeriksa Status..." : "Sudah Bayar? Cek Status Sekarang"}
              </button>
            </div>

            {/* Details & Instructions */}
            <div className="space-y-6 md:col-span-6">
              {/* Film Order Details */}
              <div className="border border-line bg-white p-5 shadow-warm">
                <span className="font-mono text-[11px] uppercase tracking-wider text-reel">
                  Detail Pemesanan
                </span>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">
                  {booking.filmTitle}
                </h3>
                <div className="mt-4 space-y-2 border-t border-line pt-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-reel">Tanggal:</span>
                    <span className="font-semibold text-ink">{dateStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-reel">Pukul:</span>
                    <span className="font-bold text-[#A6610A]">{timeStr} WIB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-reel">Studio:</span>
                    <span className="text-ink">{booking.auditorium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-reel">Pemesan:</span>
                    <span className="text-ink">{booking.customerName}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="border border-line bg-white p-5 shadow-warm">
                <h3 className="font-mono text-xs font-bold uppercase text-ink">
                  Petunjuk Pembayaran
                </h3>
                <ol className="mt-3 space-y-2 text-xs text-reel">
                  <li>1. Buka aplikasi perbankan atau e-wallet (BCA, GoPay, OVO, Dana).</li>
                  <li>2. Pilih menu <strong>Bayar</strong> atau <strong>Pindai QR</strong>.</li>
                  <li>3. Arahkan kamera ke kode QRIS di samping.</li>
                  <li>4. Pastikan nominal sesuai: <strong>Rp {booking.totalAmount.toLocaleString("id-ID")}</strong>.</li>
                  <li>5. Layar beralih otomatis setelah pelunasan dikonfirmasi server.</li>
                </ol>
              </div>

              {/* Testing Tool Panel */}
              <div className="border border-line bg-[#FAF8F5] p-5">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="font-mono text-xs font-bold uppercase text-ink">
                    Simulasi Gateway (Mode Pengujian)
                  </span>
                  <span className="border border-[#1D99DE] bg-[#1D99DE]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#1D99DE]">
                    TEST TOOL
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-reel">
                  Simulasikan notifikasi webhook gateway untuk menyelesaikan transaksi:
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => triggerSimulation("settlement")}
                    className="bg-[#1D99DE] py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#1482BE] disabled:opacity-50"
                  >
                    {isSimulating ? "Mengirim Webhook..." : "Simulasikan Bayar Berhasil"}
                  </button>
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => triggerSimulation("expire")}
                    className="border border-line bg-white py-1.5 font-mono text-xs text-reel hover:border-ink hover:text-ink disabled:opacity-50"
                  >
                    Simulasikan Kedaluwarsa (Gagal)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: EXPIRED / FAILED */}
      {isExpired && (
        <div className="border border-line bg-white p-8 shadow-warm-lg text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[#D21871]/30 bg-[#D21871]/10 text-2xl text-[#D21871]">
            ✕
          </div>
          <span className="mt-4 inline-block border border-[#D21871]/40 bg-[#D21871]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-[#D21871]">
            Status: Gagal / Kedaluwarsa
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-ink">
            Batas Waktu Pembayaran Telah Habis
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-reel">
            Transaksi dengan kode booking <strong>{booking.bookingCode}</strong> telah
            melewati batas waktu pembayaran 15 menit. Kuota tiket telah dilepaskan
            kembali ke sistem.
          </p>

          <div className="mx-auto mt-6 max-w-sm border border-line bg-[#FAF8F5] p-4 text-left font-mono text-xs text-reel">
            <p><strong>Film:</strong> {booking.filmTitle}</p>
            <p className="mt-1"><strong>Waktu:</strong> {dateStr}, {timeStr} WIB</p>
            <p className="mt-1"><strong>Jumlah:</strong> {booking.ticketCount} Tiket</p>
            <p className="mt-1"><strong>Total:</strong> Rp {booking.totalAmount.toLocaleString("id-ID")}</p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={`/films/${booking.filmId}`}
              className="bg-[#D21871] px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#B4115F]"
            >
              Pesan Ulang Tiket Ini →
            </Link>
            <Link
              href="/dashboard"
              className="border border-line bg-white px-6 py-2.5 font-mono text-xs font-semibold text-ink hover:border-ink"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* STATE 3: PAID / SUCCESS */}
      {isPaid && (
        <div className="space-y-6">
          <div className="border border-line bg-white p-6 shadow-warm text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1D99DE]/10 text-xl text-[#1D99DE]">
              ✓
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink">
              Pembayaran Berhasil Dikonfirmasi!
            </h2>
            <p className="mt-1 text-sm text-reel">
              Tiket digital Anda telah aktif dan dapat langsung digunakan saat masuk auditorium.
            </p>
            <div className="mt-4">
              <Link
                href="/dashboard"
                className="inline-block bg-[#1D99DE] px-6 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#1482BE]"
              >
                Lihat Semua Tiket di Dashboard →
              </Link>
            </div>
          </div>

          {/* Ticket Pass presentation */}
          <div className="border-2 border-line bg-white p-6 shadow-warm-lg sm:p-8">
            <div className="flex flex-col justify-between border-b border-line pb-6 sm:flex-row sm:items-baseline">
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#1D99DE]">
                  Tiket Masuk Resmi
                </span>
                <h3 className="mt-1 font-display text-3xl font-bold text-ink">
                  {booking.filmTitle}
                </h3>
              </div>
              <div className="mt-2 sm:mt-0 font-mono text-xs text-reel">
                Kode Booking: <strong className="text-ink">{booking.bookingCode}</strong>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-b border-line pb-6 sm:grid-cols-4 font-mono text-xs">
              <div>
                <span className="block text-reel">Tanggal</span>
                <span className="font-semibold text-ink">{dateStr}</span>
              </div>
              <div>
                <span className="block text-reel">Pukul</span>
                <span className="font-bold text-[#A6610A]">{timeStr} WIB</span>
              </div>
              <div>
                <span className="block text-reel">Studio</span>
                <span className="font-semibold text-ink">{booking.auditorium}</span>
              </div>
              <div>
                <span className="block text-reel">Jumlah</span>
                <span className="font-bold text-[#D21871]">{booking.ticketCount} Tiket</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center p-4 bg-[#FAF8F5] border border-line">
              <QrCodeVisual
                value={`PASS-${booking.bookingCode}`}
                size={160}
                darkColor="#121110"
                lightColor="#FFFFFF"
              />
              <span className="mt-3 font-mono text-xs font-bold tracking-wider text-ink">
                PASS-{booking.bookingCode}
              </span>
              <span className="mt-1 font-mono text-[10px] text-reel">
                Tunjukkan QR ini ke petugas auditorium
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
