"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import QrCodeVisual from "@/components/ui/QrCodeVisual";
import { getFilmPalette } from "@/lib/film-palettes";

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
    filmSlug?: string;
    posterUrl: string;
    auditorium: string;
    startTime: string;
    ticketCodes?: string[];
  };
}

export default function PayClient({ initialBooking }: PayClientProps) {
  const [booking, setBooking] = useState(initialBooking);
  const palette = getFilmPalette(booking.filmSlug || booking.filmId);
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
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
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
              <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                Selesaikan Pembayaran QRIS
              </h1>
            </div>
            <div className="mt-3 text-left font-mono sm:mt-0 sm:text-right">
              <span className="block text-[10px] uppercase text-reel">
                Sisa Waktu Pembayaran
              </span>
              <span className="inline-block border border-line bg-paper-card px-3 py-1 text-base sm:text-lg font-bold text-ink">
                {timeLeft || "15:00"}
              </span>
            </div>
          </div>

          <div className="mt-6 sm:mt-8 grid grid-cols-1 items-start gap-8 md:grid-cols-12">
            {/* QR Code Presentation */}
            <div className="flex flex-col items-center border border-line bg-paper-card p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] rounded-none md:col-span-6">
              <div className="w-full border-b border-line pb-3 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="font-mono text-xl font-bold tracking-widest text-ink">
                    QRIS
                  </span>
                </div>
                <p className="mt-0.5 font-mono text-[10px] text-reel">
                  Standar Pembayaran Nasional
                </p>
              </div>

              <div className="my-6 border border-line bg-paper p-3 shadow-xs">
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
                <div className="mt-1 font-mono text-2xl font-bold text-ink">
                  <span>Rp {booking.totalAmount.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 font-mono text-[11px] text-reel">
                <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
                <span>Menunggu konfirmasi pembayaran...</span>
              </div>

              <button
                type="button"
                onClick={checkStatus}
                disabled={isChecking}
                className="mt-5 w-full rounded-md border border-line bg-paper py-2.5 font-mono text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper disabled:opacity-50 cursor-pointer"
              >
                {isChecking ? "Memeriksa Status..." : "Sudah Bayar? Cek Status Sekarang"}
              </button>
            </div>

            {/* Details & Instructions */}
            <div className="space-y-6 md:col-span-6">
              {/* Film Order Details */}
              <div className="border border-line bg-paper-card p-5 shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
                <span className="font-mono text-[11px] uppercase tracking-wider text-reel">
                  Detail Pemesanan
                </span>
                <h3 className="mt-1 font-serif text-xl font-medium text-ink">
                  {booking.filmTitle}
                </h3>
                <div className="mt-4 space-y-2 border-t border-line pt-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-reel">Tanggal:</span>
                    <span className="font-semibold text-ink">{dateStr}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-reel">Pukul:</span>
                    <span className="font-bold text-ink">{timeStr} WIB</span>
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
              <div className="border border-line bg-paper-card p-5 shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
                <h3 className="font-mono text-xs font-semibold uppercase text-ink">
                  Petunjuk Pembayaran
                </h3>
                <ol className="mt-3 space-y-2 text-xs text-reel font-sans">
                  <li>1. Buka aplikasi perbankan atau e-wallet (BCA, GoPay, OVO, Dana).</li>
                  <li>2. Pilih menu <strong>Bayar</strong> atau <strong>Pindai QR</strong>.</li>
                  <li>3. Arahkan kamera ke kode QRIS di samping.</li>
                  <li>4. Pastikan nominal sesuai: <strong>Rp {booking.totalAmount.toLocaleString("id-ID")}</strong>.</li>
                  <li>5. Layar beralih otomatis setelah pelunasan dikonfirmasi server.</li>
                </ol>
              </div>

              {/* Testing Tool Panel */}
              <div className="border border-line bg-paper p-5">
                <div className="flex items-center justify-between border-b border-line pb-2">
                  <span className="font-mono text-xs font-semibold uppercase text-ink">
                    Simulasi Gateway (Mode Pengujian)
                  </span>
                  <span className="border border-line bg-paper-card px-1.5 py-0.5 font-mono text-[9px] font-bold text-reel">
                    TEST TOOL
                  </span>
                </div>
                <p className="mt-2 text-xs text-reel leading-relaxed font-sans">
                  Simulasikan notifikasi webhook gateway untuk menyelesaikan transaksi:
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => triggerSimulation("settlement")}
                    className="rounded-md bg-ink py-2 text-xs font-mono uppercase tracking-wider text-paper shadow-xs hover:bg-ink/90 disabled:opacity-50 cursor-pointer"
                  >
                    {isSimulating ? "Mengirim Webhook..." : "Simulasikan Bayar Berhasil"}
                  </button>
                  <button
                    type="button"
                    disabled={isSimulating}
                    onClick={() => triggerSimulation("expire")}
                    className="rounded-md border border-line bg-paper-card py-1.5 font-mono text-xs text-reel hover:border-ink hover:text-ink disabled:opacity-50 cursor-pointer"
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
        <div className="border border-line bg-paper-card p-6 sm:p-10 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#D21871]/40 bg-[#D21871]/10 font-mono text-lg text-[#D21871]">
            ✕
          </div>
          <span className="mt-4 inline-block border border-[#D21871]/40 bg-[#D21871]/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-[#D21871] font-semibold">
            Status: Gagal / Kedaluwarsa
          </span>
          <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
            Batas Waktu Pembayaran Telah Habis
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-reel leading-relaxed">
            Transaksi dengan kode booking <strong className="font-mono text-ink">{booking.bookingCode}</strong> telah
            melewati batas waktu pembayaran 15 menit. Kuota tiket telah dilepaskan
            kembali ke sistem.
          </p>

          <div className="mx-auto mt-6 max-w-sm border border-line bg-paper p-4 text-left font-mono text-xs text-reel space-y-1">
            <p><strong className="text-ink">Film:</strong> {booking.filmTitle}</p>
            <p><strong className="text-ink">Waktu:</strong> {dateStr}, {timeStr} WIB</p>
            <p><strong className="text-ink">Jumlah:</strong> {booking.ticketCount} Tiket</p>
            <p><strong className="text-ink">Total:</strong> Rp {booking.totalAmount.toLocaleString("id-ID")}</p>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <Link
              href={`/films/${booking.filmSlug || booking.filmId}`}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider text-paper transition-opacity hover:opacity-90 shadow-xs"
              style={{ backgroundColor: palette.accent }}
            >
              Pesan Ulang Tiket Ini
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center border border-line bg-paper px-6 py-2.5 rounded-md font-mono text-xs font-medium text-ink hover:border-[#1D99DE]"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      )}

      {/* STATE 3: PAID / SUCCESS */}
      {isPaid && (
        <div className="space-y-6">
          <div className="border border-line bg-paper-card p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] text-center">
            <div
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border text-lg font-bold"
              style={{ borderColor: `${palette.accent}50`, backgroundColor: `${palette.accent}18`, color: palette.accent }}
            >
              ✓
            </div>
            <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
              Pembayaran Berhasil Dikonfirmasi
            </h2>
            <p className="mt-2 text-sm text-reel">
              Tiket digital Anda telah aktif dan dapat langsung ditunjukkan saat masuk auditorium.
            </p>
            <div className="mt-5">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center bg-[#1D99DE] text-white px-6 py-2.5 rounded-md font-mono text-xs font-semibold uppercase tracking-wider hover:bg-[#1582BD] shadow-xs"
              >
                Lihat Semua Tiket di Dashboard
              </Link>
            </div>
          </div>

          {/* Ticket Pass presentation */}
          <div
            className="border border-line bg-paper-card p-5 sm:p-8 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)] relative"
            style={{ borderLeftWidth: "4px", borderLeftColor: palette.accent }}
          >
            <div className="flex flex-col justify-between border-b border-line pb-4 sm:pb-6 sm:flex-row sm:items-baseline">
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                  <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
                  <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                  <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                  <span
                    className="font-mono text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: palette.accent }}
                  >
                    Tiket Masuk Resmi
                  </span>
                </div>
                <h3 className="mt-1 font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink break-words">
                  {booking.filmTitle}
                </h3>
              </div>
              <div className="mt-2 sm:mt-0 font-mono text-xs text-reel">
                Kode Booking: <strong className="text-ink font-mono">{booking.bookingCode}</strong>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 border-b border-line pb-6 sm:grid-cols-4 font-mono text-xs">
              <div>
                <span className="block text-reel text-[11px]">Tanggal</span>
                <span className="font-medium text-ink">{dateStr}</span>
              </div>
              <div>
                <span className="block text-reel text-[11px]">Pukul</span>
                <span className="font-bold text-[#A6610A]">{timeStr} WIB</span>
              </div>
              <div>
                <span className="block text-reel text-[11px]">Studio</span>
                <span className="font-medium text-ink">{booking.auditorium}</span>
              </div>
              <div>
                <span className="block text-reel text-[11px]">Jumlah</span>
                <span className="font-bold text-[#D21871]">{booking.ticketCount} Kursi</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col items-center justify-center p-6 bg-paper border border-dashed border-line">
              <QrCodeVisual
                value={`PASS-${booking.bookingCode}`}
                size={160}
                darkColor="#121110"
                lightColor="#FFFFFF"
              />
              <span className="mt-3 font-mono text-xs font-bold tracking-widest text-ink">
                PASS-{booking.bookingCode}
              </span>
              <span className="mt-1 font-mono text-[10px] text-reel">
                Tunjukkan kode QR ini ke petugas pintu masuk auditorium
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
