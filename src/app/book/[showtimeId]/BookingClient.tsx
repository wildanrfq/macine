"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import QrCodeVisual from "@/components/ui/QrCodeVisual";

interface BookingClientProps {
  showtime: {
    id: string;
    startTime: string;
    auditorium: string;
    capacity: number;
    price: number;
    film: {
      id: string;
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
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      {/* Main Booking Panel */}
      <div className="lg:col-span-8">
        {/* Step Indicator */}
        <div className="flex border-b border-line pb-4 text-xs font-mono">
          <div
            className={`flex items-center gap-2 pr-6 ${
              step === 1 ? "font-bold text-[#D21871]" : "text-reel"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 ${
                step === 1
                  ? "border border-[#D21871] bg-[#D21871]/10 text-[#D21871]"
                  : "border border-line text-reel"
              }`}
            >
              01
            </span>
            <span>Jumlah Tiket</span>
          </div>
          <div
            className={`flex items-center gap-2 px-6 border-l border-line ${
              step === 2 ? "font-bold text-[#D21871]" : "text-reel"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 ${
                step === 2
                  ? "border border-[#D21871] bg-[#D21871]/10 text-[#D21871]"
                  : "border border-line text-reel"
              }`}
            >
              02
            </span>
            <span>Data Pemesan</span>
          </div>
          <div
            className={`flex items-center gap-2 px-6 border-l border-line ${
              step === 3 ? "font-bold text-[#1D99DE]" : "text-reel"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 ${
                step === 3
                  ? "border border-[#1D99DE] bg-[#1D99DE]/10 text-[#1D99DE]"
                  : "border border-line text-reel"
              }`}
            >
              03
            </span>
            <span>Bayar QRIS</span>
          </div>
          <div
            className={`flex items-center gap-2 pl-6 border-l border-line ${
              step === 4 ? "font-bold text-[#F49924]" : "text-reel"
            }`}
          >
            <span
              className={`px-1.5 py-0.5 ${
                step === 4
                  ? "border border-[#F49924] bg-[#F49924]/10 text-[#F49924]"
                  : "border border-line text-reel"
              }`}
            >
              04
            </span>
            <span>Tiket Digital</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-6 border border-[#D21871]/30 bg-[#D21871]/10 p-4 text-xs font-mono text-[#D21871]">
            Perhatian: {errorMessage}
          </div>
        )}

        {/* STEP 1: Ticket Quantity Selector (Free-Seating) */}
        {step === 1 && (
          <div className="mt-8">
            <div className="flex items-baseline justify-between border-b border-line pb-4">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">
                  Tentukan Jumlah Tiket
                </h2>
                <p className="mt-1 text-xs text-reel">
                  Sistem Free-Seating (bebas pilih kursi saat tiba di ruang
                  putar).
                </p>
              </div>

              <div className="font-mono text-xs text-right">
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
              <div className="mt-8 space-y-8">
                <div className="border border-line bg-white p-6 sm:p-8 shadow-warm">
                  <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-6">
                    <div>
                      <span className="border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#1277B0]">
                        Tiket Masuk Reguler
                      </span>
                      <h3 className="mt-2 font-display text-2xl font-bold text-ink">
                        Akses Penuh Auditorium
                      </h3>
                      <div className="mt-1 flex items-center gap-1.5 font-mono text-xs font-bold text-ink">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                        <span>Rp {showtime.price.toLocaleString("id-ID")}</span>
                        <span className="font-normal text-reel">/ orang</span>
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center border border-line bg-[#FAF8F5]">
                      <button
                        type="button"
                        disabled={ticketCount <= 1}
                        onClick={() => setTicketCount((prev) => Math.max(1, prev - 1))}
                        className="flex h-12 w-12 items-center justify-center font-mono text-lg font-bold text-ink transition-colors hover:bg-[#1D99DE] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                      >
                        -
                      </button>

                      <div className="flex h-12 w-16 items-center justify-center border-x border-line bg-white font-mono text-lg font-bold text-ink">
                        {ticketCount}
                      </div>

                      <button
                        type="button"
                        disabled={ticketCount >= maxAllowed}
                        onClick={() =>
                          setTicketCount((prev) => Math.min(maxAllowed, prev + 1))
                        }
                        className="flex h-12 w-12 items-center justify-center font-mono text-lg font-bold text-ink transition-colors hover:bg-[#1D99DE] hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Preset quick buttons */}
                  <div className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs font-mono text-reel">
                    <span>Pilihan Cepat:</span>
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        disabled={num > remainingTickets}
                        onClick={() => setTicketCount(num)}
                        className={`border px-3 py-1 transition-colors ${
                          ticketCount === num
                            ? "border-[#1D99DE] bg-[#1D99DE] text-white font-bold shadow-sm"
                            : "border-line bg-white text-ink hover:border-[#1D99DE]"
                        } disabled:opacity-30`}
                      >
                        {num} Tiket
                      </button>
                    ))}
                  </div>
                </div>

                {/* Free Seating Explanation Note */}
                <div className="border border-[#F49924]/30 bg-[#F49924]/5 p-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                    <h4 className="font-mono text-xs font-bold uppercase text-[#A6610A]">
                      Ketentuan Tempat Duduk (Free-Seating)
                    </h4>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-reel">
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
                    className="bg-[#D21871] px-8 py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#B4115F] hover:shadow-lg"
                  >
                    Lanjutkan ke Data Pemesan ({ticketCount} Tiket) &rarr;
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 border border-dashed border-line bg-white p-12 text-center shadow-warm">
                <p className="text-sm text-reel">
                  Mohon maaf, tiket untuk sesi pemutaran ini telah habis
                  terjual.
                </p>
                <Link
                  href="/films"
                  className="mt-4 inline-block bg-[#D21871] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#B4115F]"
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
            <h2 className="font-display text-2xl font-bold text-ink">
              Data Pemesan Tiket
            </h2>
            <p className="mt-1 text-xs text-reel">
              Tiket digital sebanyak {ticketCount} tiket akan diterbitkan atas
              nama kontak ini.
            </p>

            {initialUser && (
              <div className="mt-4 flex items-center gap-2 border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-3.5 py-2 text-xs text-[#1277B0]">
                <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
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
                  className="mt-1 w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-[#1D99DE] focus:ring-1 focus:ring-[#1D99DE] focus:outline-none"
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
                  className="mt-1 w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-[#1D99DE] focus:ring-1 focus:ring-[#1D99DE] focus:outline-none"
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
                  className="mt-1 w-full border border-line bg-white px-3.5 py-2.5 text-sm text-ink shadow-sm focus:border-[#1D99DE] focus:ring-1 focus:ring-[#1D99DE] focus:outline-none"
                />
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-line bg-white px-4 py-2 text-xs font-mono text-reel hover:border-[#1D99DE] hover:text-[#1D99DE]"
                >
                  &larr; Ubah Jumlah Tiket
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#D21871] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#B4115F] disabled:opacity-50"
                >
                  {isLoading ? "Memproses Tagihan..." : "Buat Tagihan QRIS &rarr;"}
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
                <h2 className="font-display text-3xl font-bold text-ink">
                  Pembayaran QRIS
                </h2>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-reel block uppercase">
                  Sisa Waktu
                </span>
                <span className="border border-[#F49924]/40 bg-[#F49924]/10 px-2.5 py-0.5 text-base font-bold text-[#A6610A]">
                  {timeLeft || "15:00"}
                </span>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12 items-start">
              {/* QR Code Presentation */}
              <div className="md:col-span-6 flex flex-col items-center border border-line bg-white p-6 shadow-warm-lg">
                <div className="w-full text-center border-b border-line pb-3">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
                    <span className="font-display text-xl font-bold tracking-widest text-ink">
                      QRIS
                    </span>
                    <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                  </div>
                  <p className="text-[10px] font-mono text-reel mt-0.5">
                    Pembayaran Standar Nasional
                  </p>
                </div>

                <div className="my-6 border-2 border-line p-3 bg-white shadow-inner">
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
                  <div className="mt-1 flex items-center justify-center gap-2 font-mono text-2xl font-bold text-ink">
                    <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                    <span>Rp {booking.totalAmount.toLocaleString("id-ID")}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-[11px] text-reel font-mono">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#1D99DE] animate-pulse" />
                  <span>Menunggu konfirmasi pembayaran...</span>
                </div>

                <button
                  type="button"
                  onClick={checkStatus}
                  className="mt-5 w-full border border-[#1D99DE] bg-[#1D99DE]/5 py-2 font-mono text-xs font-semibold text-[#1D99DE] transition-colors hover:bg-[#1D99DE] hover:text-white"
                >
                  Sudah Bayar? Cek Status Sekarang
                </button>
              </div>

              {/* Instructions & Test Simulator Panel */}
              <div className="md:col-span-6 space-y-6">
                <div className="border border-line bg-white p-5 shadow-warm">
                  <h3 className="font-mono text-xs font-bold uppercase text-ink">
                    Petunjuk Pembayaran
                  </h3>
                  <ol className="mt-3 space-y-2 text-xs text-reel">
                    <li>1. Buka aplikasi perbankan atau e-wallet (BCA, GoPay, OVO, Dana).</li>
                    <li>2. Pilih menu Bayar atau Pindai QR.</li>
                    <li>3. Arahkan kamera ke kode QRIS di samping.</li>
                    <li>4. Pastikan nominal sesuai: Rp {booking.totalAmount.toLocaleString("id-ID")}.</li>
                    <li>5. Layar beralih otomatis setelah pelunasan dikonfirmasi server.</li>
                  </ol>
                </div>

                {/* Testing Tool Box */}
                <div className="border border-line bg-[#FAF8F5] p-5">
                  <div className="flex items-center justify-between border-b border-line pb-2">
                    <span className="font-mono text-xs font-bold uppercase text-ink">
                      Simulasi Gateway (Mode Uji Coba)
                    </span>
                    <span className="border border-[#1D99DE] bg-[#1D99DE]/10 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#1D99DE]">
                      TEST TOOL
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-reel leading-relaxed">
                    Uji coba notifikasi webhook secara langsung untuk menyelesaikan transaksi:
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => triggerSimulation("settlement")}
                      className="bg-[#1D99DE] py-2 text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#1482BE] disabled:opacity-50"
                    >
                      {isSimulating
                        ? "Mengirim Webhook..."
                        : "Simulasikan Bayar Berhasil (Kirim Webhook)"}
                    </button>

                    <button
                      type="button"
                      disabled={isSimulating}
                      onClick={() => triggerSimulation("expire")}
                      className="border border-line bg-white py-1.5 text-xs font-mono text-reel hover:border-ink hover:text-ink disabled:opacity-50"
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
          <div className="mt-8">
            <div className="border-2 border-line bg-white text-ink p-6 sm:p-8 relative shadow-warm-lg">
              <div className="flex flex-col justify-between border-b border-line pb-6 sm:flex-row sm:items-baseline">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
                    <span className="h-2 w-2 rounded-full bg-[#F49924]" />
                    <span className="h-2 w-2 rounded-full bg-[#D21871]" />
                    <span className="font-mono text-xs text-reel uppercase tracking-wider ml-1">
                      Tiket Masuk Resmi
                    </span>
                  </div>
                  <h2 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
                    BIOSKOP MINI CIKINI
                  </h2>
                </div>
                <span className="mt-2 sm:mt-0 border border-[#1D99DE] bg-[#1D99DE]/10 px-3 py-1 font-mono text-xs font-bold uppercase text-[#1277B0]">
                  Lunas / QRIS Terkonfirmasi
                </span>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <span className="font-mono text-xs text-reel uppercase">
                      Film
                    </span>
                    <h3 className="font-display text-2xl font-bold text-ink">
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
                      <span className="font-mono font-bold text-ink">
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
                        {booking.ticketCount} Orang (Free-Seating)
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
                  <div className="border border-line p-2 bg-[#FAF8F5] shadow-sm">
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

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
              <Link
                href="/films"
                className="border border-line bg-white px-4 py-2 text-xs font-mono text-reel hover:border-[#1D99DE] hover:text-[#1D99DE]"
              >
                &larr; Kembali ke Katalog Film
              </Link>

              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="bg-[#D21871] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-md hover:bg-[#B4115F]"
                >
                  Buka Tiket Saya (Dashboard) &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Sidebar */}
      <div className="lg:col-span-4">
        <div className="border border-line bg-white p-6 shadow-warm">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#1D99DE]" />
            <span className="font-mono text-xs font-bold uppercase text-reel">
              Ringkasan Tiket
            </span>
          </div>

          <div className="mt-4 flex gap-4">
            <div className="aspect-[2/3] w-20 flex-shrink-0 overflow-hidden bg-ink">
              <img
                src={showtime.film.posterUrl}
                alt={showtime.film.title}
                className="h-full w-full object-cover"
              />
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-ink">
                {showtime.film.title}
              </h3>
              <p className="mt-1 font-mono text-xs text-reel">
                {showtime.film.durationMinutes} Min | Klasifikasi{" "}
                {showtime.film.rating}
              </p>
              <p className="mt-2 text-xs text-reel">
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
            <div className="flex items-center gap-1.5 font-mono text-xl font-bold text-ink">
              <span className="h-2 w-2 rounded-full bg-[#F49924]" />
              <span>Rp {totalPrice.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
