"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal masuk. Periksa email dan kata sandi.");
      }

      router.push(redirect);
      router.refresh();
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Terjadi kesalahan saat masuk."
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
          Akun Penonton
        </span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-ink">
          Masuk ke Bioskop
        </h1>
        <p className="mt-1 text-xs text-reel">
          Akses tiket aktif dan riwayat pemesanan Anda
        </p>
      </div>

      {errorMessage && (
        <div className="mt-4 border border-[#D21871]/30 bg-[#D21871]/10 p-3 text-xs font-mono text-[#D21871]">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="block font-mono text-xs uppercase text-reel">
              Kata Sandi
            </label>
          </div>
          <input
            type="password"
            required
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
            {isLoading ? "Memverifikasi..." : "Masuk ke Akun"}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-line pt-4 text-center">
        <p className="text-xs text-reel">
          Belum memiliki akun penonton?{" "}
          <Link
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-[#1D99DE] hover:underline"
          >
            Daftar Sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-6 py-16">
        <Suspense fallback={<div className="font-mono text-xs text-reel">Memuat...</div>}>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
