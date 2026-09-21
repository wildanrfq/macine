"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const urlError = searchParams.get("error");
  const [errorMessage, setErrorMessage] = useState<string | null>(urlError);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mendaftar.");
      }

      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan pendaftaran."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md border border-line bg-white p-8 shadow-warm-lg">
      <div className="border-b border-line pb-4 text-center">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#1D99DE]" />
          <span className="h-2 w-2 rounded-full bg-[#F49924]" />
          <span className="h-2 w-2 rounded-full bg-[#D21871]" />
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-reel">
          Registrasi Penonton
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
          Buat Akun Baru
        </h1>
        <p className="mt-1 text-xs text-reel">
          Simpan tiket, riwayat pesanan, dan nikmati pemesanan lebih cepat
        </p>
      </div>

      {/* Google Signup Option */}
      <div className="mt-6">
        <a
          href="/api/auth/google"
          className="flex w-full items-center justify-center gap-3 border border-line bg-paper px-4 py-2.5 text-xs font-semibold text-ink shadow-sm transition-all hover:border-[#1D99DE] hover:shadow"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>Daftar dengan Google</span>
        </a>

        <div className="relative mt-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-line" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 font-mono text-reel">
              atau isi data manual
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-4 border border-[#D21871]/30 bg-[#D21871]/10 p-3 text-xs font-mono text-[#D21871]">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div>
          <label className="block font-mono text-xs uppercase text-reel">
            Nama Lengkap
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Raden Arya"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full border border-line bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-ink focus:border-[#1D99DE] focus:bg-white focus:outline-none"
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-line bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-ink focus:border-[#1D99DE] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase text-reel">
            Nomor WhatsApp / HP
          </label>
          <input
            type="tel"
            placeholder="08123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full border border-line bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-ink focus:border-[#1D99DE] focus:bg-white focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-xs uppercase text-reel">
            Kata Sandi (Minimal 6 Karakter)
          </label>
          <input
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full border border-line bg-[#FAF8F5] px-3.5 py-2.5 text-sm text-ink focus:border-[#1D99DE] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#D21871] py-3 text-xs font-semibold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#B4115F] disabled:opacity-50"
          >
            {isLoading ? "Mendaftarkan..." : "Daftar Akun Sekarang"}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-line pt-4 text-center">
        <p className="text-xs text-reel">
          Sudah memiliki akun?{" "}
          <Link
            href={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-[#1D99DE] hover:underline"
          >
            Masuk di Sini
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Suspense fallback={<div className="font-mono text-xs text-reel">Memuat...</div>}>
          <RegisterForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
