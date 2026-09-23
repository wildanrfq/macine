"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import QrCodeVisual from "@/components/ui/QrCodeVisual";
import { getFilmPalette } from "@/lib/film-palettes";

interface BookingClientProps {
  showtime: {
    id: string;
    startTime: string;
    auditorium: string;
    capacity: number;
    price: number;
    film: {
      id: string;
      slug?: string;
      title: string;
      posterUrl: string;
      durationMinutes: number;
      rating: string;
    };
  };
  remainingTickets: number;
  initialUser?: {
    name: string;
    email: string;
    phone?: string | null;
  } | null;
}

interface ActiveBooking {
  bookingCode: string;
  ticketCount: number;
  totalAmount: number;
  paymentStatus: string;
  qrisString: string;
  expiresAt: string;
  isSimulated: boolean;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  filmTitle: string;
  auditorium: string;
  startTime: string;
  ticketCodes: string[];
}

export default function BookingClient({
  showtime,
  remainingTickets,
  initialUser,
}: BookingClientProps) {
  const palette = getFilmPalette(showtime.film.slug || showtime.film.id);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [ticketCount, setTicketCount] = useState<number>(1);
  const [customerName, setCustomerName] = useState(initialUser?.name || "");
  const [customerEmail, setCustomerEmail] = useState(initialUser?.email || "");
  const [customerPhone, setCustomerPhone] = useState(initialUser?.phone || "");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [booking, setBooking] = useState<ActiveBooking | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const maxAllowed = Math.min(remainingTickets, 6);
  const totalPrice = ticketCount * showtime.price;

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showtimeId: showtime.id,
          ticketCount,
          customerName,
          customerEmail,
          customerPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat pesanan.");
      }

      setBooking(data.booking);
      setStep(3);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan sistem."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const bookingCode = booking?.bookingCode;

  const checkStatus = useCallback(async () => {
    if (!bookingCode || step !== 3) return;

    try {
      const res = await fetch(`/api/bookings/${bookingCode}/status`);
      if (res.ok) {
        const data = await res.json();
        if (data.paymentStatus === "PAID") {
          setBooking((prev) =>
            prev ? { ...prev, paymentStatus: "PAID" } : null
          );
          setStep(4);
        } else if (data.paymentStatus === "EXPIRED") {
          setBooking((prev) =>
            prev ? { ...prev, paymentStatus: "EXPIRED" } : null
          );
          setErrorMessage(
            "Sesi pembayaran telah kedaluwarsa. Silakan ulangi pemesanan."
          );
        }
      }
    } catch (err) {
      console.error("Status polling failed", err);
    }
  }, [bookingCode, step]);

  useEffect(() => {
    if (step !== 3 || !bookingCode) return;

    const interval = setInterval(() => {
      checkStatus();
    }, 2500);

    return () => clearInterval(interval);
  }, [step, bookingCode, checkStatus]);

  useEffect(() => {
    if (step !== 3 || !booking?.expiresAt) return;

    const expiryTime = new Date(booking.expiresAt).getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const difference = expiryTime - now;

      if (difference <= 0) {
        setTimeLeft("00:00");
        clearInterval(timer);
      } else {
        const minutes = Math.floor(difference / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        setTimeLeft(
          `${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [step, booking?.expiresAt]);

  const triggerSimulation = async (status: "settlement" | "expire") => {
    if (!bookingCode) return;
    setIsSimulating(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payment/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingCode,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memicu simulasi webhook.");
      }

      await checkStatus();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Gagal memproses simulasi webhook."
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="grid grid-cols-1 gap-8 lg:gap-12 lg:grid-cols-12">
      {/* Main Booking Panel */}
      <div className="lg:col-span-8">
        {/* Mobile Step Indicator */}
        <div className="sm:hidden border-b border-line pb-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-ink">
              Langkah 0{step} / 04
            </span>
            <span className="text-reel">
              {step === 1
                ? "Jumlah Tiket"
                : step === 2
                ? "Data Pemesan"
                : step === 3
                ? "Bayar QRIS"
                : "Tiket Digital"}
            </span>
          </div>
          <div className="mt-2.5 grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 transition-colors ${
                  s <= step ? "bg-ink" : "bg-line"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop Step Indicator */}
        <div className="hidden sm:flex border-b border-line pb-4 text-xs font-mono">
          {[
            { num: 1, label: "Jumlah Tiket" },
            { num: 2, label: "Data Pemesan" },
            { num: 3, label: "Bayar QRIS" },
            { num: 4, label: "Tiket Digital" },
          ].map((item, idx) => {
            const isActive = step === item.num;
            return (
              <div
                key={item.num}
                className={`flex items-center gap-2 ${idx > 0 ? "px-6 border-l border-line" : "pr-6"} ${
                  isActive ? "font-bold text-ink" : "text-reel"
                }`}
              >
                <span
                  className={`px-1.5 py-0.5 rounded-none font-mono ${
                    isActive
                      ? "border border-ink bg-ink text-paper"
                      : "border border-line text-reel"
                  }`}
                >
                  0{item.num}
                </span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {errorMessage && (
          <div className="mt-6 border border-line bg-paper-card p-4 text-xs font-mono text-ink">
            Perhatian: {errorMessage}
          </div>
        )}

        {/* STEP 1: Ticket Quantity Selector (Free-Seating) */}
        {step === 1 && (
          <div className="mt-6 sm:mt-8">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-line pb-4 gap-2">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                  Tentukan Jumlah Tiket
                </h2>
                <p className="mt-1 text-xs text-reel">
                  Sistem Free-Seating (bebas pilih kursi saat tiba di ruang
                  putar).
                </p>
              </div>

              <div className="font-mono text-xs text-left sm:text-right">
                <span className="text-reel block">Status Kuota</span>
                <span
                  className={`font-bold ${
                    remainingTickets <= 5 ? "text-[#D21871] underline" : "text-ink"
                  }`}
                >
                  Tersisa {remainingTickets} dari {showtime.capacity} Tiket
                </span>
              </div>
            </div>

            {remainingTickets > 0 ? (
              <div className="mt-6 sm:mt-8 space-y-6 sm:space-y-8">
                <div className="border border-line bg-paper-card p-5 sm:p-8 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                  <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-6">
                    <div>
                      <span
                        className="border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider font-semibold"
                        style={{ borderColor: `${palette.accent}40`, backgroundColor: `${palette.accent}12`, color: palette.accent }}
                      >
                        Tiket Masuk Reguler
                      </span>
                      <h3 className="mt-3 font-serif text-2xl font-medium text-ink">
                        Akses Penuh Auditorium
                      </h3>
                      <div className="mt-1 font-mono text-xs font-bold text-ink">
                        <span>Rp {showtime.price.toLocaleString("id-ID")}</span>
                        <span className="font-normal text-reel font-sans ml-1">/ orang</span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-line bg-paper">
                      <button
                        type="button"
                        disabled={ticketCount <= 1}
                        onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                        className="flex h-12 w-12 items-center justify-center font-mono text-lg font-bold text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink cursor-pointer"
                      >
                        -
                      </button>

                      <div className="flex h-12 w-16 items-center justify-center border-x border-line bg-paper-card font-mono text-lg font-bold text-ink">
                        {ticketCount}
                      </div>

                      <button
                        type="button"
                        disabled={ticketCount >= maxAllowed}
                        onClick={() =>
                          setTicketCount((prev) => Math.min(maxAllowed, prev + 1))
                        }
                        className="flex h-12 w-12 items-center justify-center font-mono text-lg font-bold text-ink transition-colors hover:bg-ink hover:text-paper disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs font-mono text-reel">
                    <span className="uppercase tracking-wider text-[11px]">Pilihan Cepat:</span>
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        disabled={num > remainingTickets}
                        onClick={() => setTicketCount(num)}
                        className={`rounded-xs border px-3 py-1 font-mono text-xs transition-colors cursor-pointer ${
                          ticketCount === num
                            ? "border-ink bg-ink text-paper font-bold shadow-xs"
                            : "border-line bg-paper-card text-ink hover:border-ink"
                        } disabled:opacity-30`}
                      >
                        {num} Tiket
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Seating Explanation Note */}
                <div className="border border-line bg-paper-card p-5 shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: palette.accent }}
                    />
                    <h4 className="font-mono text-xs font-semibold uppercase tracking-wider text-ink">
                      Ketentuan Tempat Duduk (Free-Seating)
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-reel font-sans">
                    Auditorium kami berkapasitas 24 kursi dengan formasi berjarak
                    lapang. Setiap pemegang tiket bebas memilih tempat duduk
                    mana saja saat memasuki ruangan secara bergantian
                    (first-come, first-served). Pintu dibuka 15 menit sebelum
                    pemutaran film dimulai.
                  </p>
                </div>

                <div className="flex justify-end border-t border-line pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto text-center rounded-md px-6 sm:px-8 py-2.5 font-mono text-xs font-medium uppercase tracking-wider shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
                    style={{
                      backgroundColor: palette.accent,
                      color: palette.accentText,
                    }}
                  >
                    Lanjutkan ke Data Pemesan ({ticketCount} Tiket)
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-line bg-paper-card p-12 text-center shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
                <p className="text-sm font-mono text-reel">
                  Mohon maaf, tiket untuk sesi pemutaran ini telah habis
                  terjual.
                </p>
                <Link
                  href="/films"
                  className="mt-4 inline-block rounded-md px-4 py-2 font-mono text-xs font-medium text-paper bg-ink hover:opacity-90 shadow-xs"
                >
                  Pilih Jadwal Lain
                </Link>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Customer Information */}
        {step === 2 && (
          <div className="mt-8">
            <h2 className="font-serif text-2xl font-medium tracking-tight text-ink">
              Data Pemesan Tiket
            </h2>
            <p className="mt-1 text-xs text-reel">
              Tiket digital sebanyak {ticketCount} tiket akan diterbitkan atas
              nama kontak ini.
            </p>

            {initialUser && (
              <div className="mt-4 flex items-center gap-2 border border-line bg-paper-card px-3.5 py-2 text-xs font-mono text-ink/80">
                <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                <span>
                  Kontak terisi otomatis dari akun <strong>{initialUser.name}</strong>. Tiket ini akan otomatis tersimpan di dashboard akun Anda.
                </span>
              </div>
            )}

            <form
              onSubmit={handleCreateBooking}
              className="mt-6 max-w-lg space-y-4"
            >
              <div>
                <label className="block font-mono text-xs uppercase text-reel">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Raden Arya"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 w-full rounded-xs border border-line bg-paper-card px-3.5 py-2.5 text-sm text-ink shadow-xs focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-reel">
                  Alamat Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="mt-1 w-full rounded-xs border border-line bg-paper-card px-3.5 py-2.5 text-sm text-ink shadow-xs focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-mono text-xs uppercase text-reel">
                  Nomor WhatsApp / Telepon
                </label>
                <input
                  type="tel"
                  required
                  placeholder="08123456789"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="mt-1 w-full rounded-xs border border-line bg-paper-card px-3.5 py-2.5 text-sm text-ink shadow-xs focus:border-ink focus:ring-1 focus:ring-ink focus:outline-none"
                />
              </div>

              <div className="mt-8 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-line pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-md border border-line bg-paper-card px-4 py-2.5 text-xs font-mono text-ink hover:border-ink text-center cursor-pointer"
                >
                  Ubah Jumlah Tiket
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-md px-8 py-2.5 font-mono text-xs font-medium uppercase tracking-wider shadow-xs transition-opacity hover:opacity-90 disabled:opacity-50 text-center cursor-pointer"
                  style={{
                    backgroundColor: palette.accent,
                    color: palette.accentText,
                  }}
                >
                  {isLoading ? "Memproses..." : "Lanjut ke Pembayaran"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* STEP 3: Live QRIS Payment Screen */}
        {step === 3 && booking && (
          <div className="mt-8">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="font-mono text-xs uppercase text-reel">
                  Kode Pemesanan: {booking.bookingCode}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink">
                  Pembayaran QRIS
                </h2>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-reel block uppercase">
                  Sisa Waktu
                </span>
                <span className="border border-line bg-paper-card px-2.5 py-0.5 text-base font-bold text-ink">
                  {timeLeft || "15:00"}
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
              {/* QR Code Presentation */}
              <div className="md:col-span-6 flex flex-col items-center border border-line bg-paper-card p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                <div className="w-full text-center border-b border-line pb-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="font-mono text-xl font-bold tracking-widest text-ink">
                      QRIS
                    </span>
                  </div>
                  <p className="text-[10px] font-mono text-reel mt-0.5">
                    Pembayaran Standar Nasional
                  </p>
                </div>

                <div className="my-6 border border-line p-3 bg-paper shadow-xs">
                  <QrCodeVisual
                    value={booking.qrisString}
                    size={220}
                    darkColor="#121110"
                    lightColor="#FFFFFF"
                  />
                </div>

                <div className="w-full text-center">
                  <span className="font-mono text-xs text-reel block">
                    Total Pembayaran ({booking.ticketCount} Tiket)
                  </span>
                  <div className="mt-1 font-mono text-2xl font-bold text-ink">
                    <span>Rp {booking.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-reel font-mono">
                  <span className="h-2 w-2 rounded-full bg-ink animate-pulse" />
                  <span>Menunggu konfirmasi pembayaran...</span>
                </div>

                <button
                  type="button"
                  onClick={checkStatus}
                  className="mt-5 w-full rounded-md border border-line bg-paper py-2 font-mono text-xs font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper cursor-pointer"
                >
                  Sudah Bayar? Cek Status Sekarang
                </button>
              </div>

              {/* Instructions & Test Simulator Panel */}
              <div className="md:col-span-6 space-y-6">
                <div className="border border-line bg-paper-card p-5 shadow-[2px_2px_0px_0px_rgba(18,17,16,0.06)]">
                  <h3 className="font-mono text-xs font-semibold uppercase text-ink">
                    Petunjuk Pembayaran
                  </h3>
                  <ol className="mt-3 space-y-2 text-xs text-reel font-sans">
                    <li>1. Buka aplikasi perbankan atau e-wallet (BCA, GoPay, OVO, Dana).</li>
                    <li>2. Pilih menu Bayar atau Pindai QR.</li>
                    <li>3. Arahkan kamera ke kode QRIS di samping.</li>
                    <li>4. Pastikan nominal sesuai: Rp {booking.totalAmount.toLocaleString("id-ID")}.</li>
                    <li>5. Layar beralih otomatis setelah pelunasan dikonfirmasi server.</li>
                  </ol>
                </div>

                {/* Testing Tool Box */}
                <div className="border border-line bg-paper p-5">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="font-mono text-xs font-semibold uppercase text-ink">
                      Simulasi Gateway (Mode Uji Coba)
                    </span>
                    <span className="border border-line bg-paper-card px-1.5 py-0.5 font-mono text-[9px] font-bold text-reel">
                      TEST TOOL
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-reel leading-relaxed font-sans">
                    Uji coba notifikasi webhook secara langsung untuk menyelesaikan transaksi:
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => triggerSimulation("settlement")}
                      className="rounded-md bg-ink py-2 text-xs font-mono uppercase tracking-wider text-paper shadow-xs hover:bg-ink/90 disabled:opacity-50 cursor-pointer"
                    >
                      {isSimulating
                        ? "Mengirim Webhook..."
                        : "Simulasikan Bayar Berhasil (Kirim Webhook)"}
                    </button>

                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => triggerSimulation("expire")}
                      className="rounded-md border border-line bg-paper-card py-1.5 text-xs font-mono text-reel hover:border-ink hover:text-ink disabled:opacity-50 cursor-pointer"
                    >
                      Simulasikan Kedaluwarsa (Expired)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Perforated Digital Ticket Stub (Free-Seating) */}
        {step === 4 && booking && (
          <div className="mt-6 sm:mt-8">
            <div className="border border-line bg-paper-card text-ink p-4 sm:p-8 relative shadow-[4px_4px_0px_0px_rgba(18,17,16,0.12)] rounded-none">
              <div className="flex flex-col justify-between border-b border-line pb-4 sm:pb-6 sm:flex-row sm:items-baseline">
                <div>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                    <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
                    <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                    <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                    <span className="font-mono text-xs text-reel uppercase tracking-wider ml-1">
                      Tiket Masuk Resmi
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-ink break-words">
                    BIOSKOP MINI CIKINI
                  </h2>
                </div>
                <span className="mt-2 sm:mt-0 inline-block border border-[#1D99DE]/40 bg-[#1D99DE]/10 px-3 py-1 font-mono text-xs uppercase tracking-wider text-[#1277B0] font-bold">
                  Lunas · QRIS Terkonfirmasi
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="font-mono text-xs text-reel uppercase">
                      Film
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-medium text-ink">
                      {booking.filmTitle || showtime.film.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-line pt-4 text-xs">
                    <div>
                      <span className="text-reel block font-mono">Tanggal</span>
                      <span className="font-medium text-ink">
                        {formatDate(showtime.startTime)}
                      </span>
                    </div>
                    <div>
                      <span className="text-reel block font-mono">Pukul</span>
                      <span className="font-mono font-bold text-[#A6610A]">
                        {formatTime(showtime.startTime)} WIB
                      </span>
                    </div>
                    <div>
                      <span className="text-reel block font-mono">Studio</span>
                      <span className="font-medium text-ink">
                        {booking.auditorium || showtime.auditorium}
                      </span>
                    </div>
                    <div>
                      <span className="text-reel block font-mono">Jumlah Tiket</span>
                      <span className="font-mono text-base font-bold text-[#D21871]">
                        {booking.ticketCount} Kursi (Free-Seating)
                      </span>
                    </div>
                    <div>
                      <span className="text-reel block font-mono">Pemesan</span>
                      <span className="font-medium text-ink">
                        {booking.customerName}
                      </span>
                    </div>
                    <div>
                      <span className="text-reel block font-mono">Kode Booking</span>
                      <span className="font-mono font-semibold text-ink">
                        {booking.bookingCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Perforated Stub QR code section */}
                <div className="md:col-span-4 flex flex-col items-center justify-center border-t border-dashed border-line pt-6 md:border-t-0 md:border-l md:pl-6">
                  <div className="border border-line p-2 bg-paper shadow-xs">
                    <QrCodeVisual
                      value={`PASS-${booking.bookingCode}`}
                      size={130}
                      darkColor="#121110"
                      lightColor="#FFFFFF"
                    />
                  </div>
                  <span className="mt-3 font-mono text-[10px] font-bold text-ink">
                    PINDAI DI PINTU MASUK
                  </span>
                  <span className="font-mono text-[9px] text-reel">
                    PASS-{booking.bookingCode}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 border-t border-line pt-6">
              <Link
                href="/films"
                className="text-center rounded-md border border-line bg-paper-card px-4 py-2.5 text-xs font-mono text-ink hover:border-ink transition-colors"
              >
                Kembali ke Katalog Film
              </Link>

              <Link
                href="/dashboard"
                className="text-center rounded-md px-6 py-2.5 font-mono text-xs font-medium uppercase tracking-wider shadow-xs transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: palette.accent,
                  color: palette.accentText,
                }}
              >
                Buka Tiket Saya (Dashboard)
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Order Sidebar */}
      <div className="lg:col-span-4">
        <div className="border border-line bg-paper-card p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.06)]">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: palette.accent }}
            />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-reel">
              Ringkasan Tiket
            </span>
          </div>

          <div className="mt-4 flex gap-4">
            <div className="aspect-[2/3] w-20 flex-shrink-0 overflow-hidden bg-ink rounded-none border border-line/60">
              <Image
                src={showtime.film.posterUrl}
                alt={showtime.film.title}
                width={80}
                height={120}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-serif text-xl font-medium text-ink">
                {showtime.film.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-reel">
                {showtime.film.durationMinutes} Min | {showtime.film.rating}
              </p>
              <p className="mt-2 text-xs text-reel font-mono">
                Studio: {showtime.auditorium}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-reel">Hari & Tanggal</span>
              <span className="font-medium text-ink">
                {formatDate(showtime.startTime)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-reel">Jam Tayang</span>
              <span className="font-mono font-bold text-ink">
                {formatTime(showtime.startTime)} WIB
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-reel">Harga Satuan</span>
              <span className="font-mono text-ink">
                Rp {showtime.price.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <span className="text-reel">Jumlah Pemesan</span>
              <span className="font-mono font-bold text-ink">
                {ticketCount} Tiket (Free-Seating)
              </span>
            </div>
          </div>

          <div className="mt-6 border-t border-line pt-4 flex justify-between items-baseline">
            <span className="font-mono text-xs text-reel uppercase">Total</span>
            <div className="font-mono text-xl font-bold text-ink">
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
