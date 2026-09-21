import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 py-12 text-ink">
      <div className="w-full max-w-sm border border-line bg-paper p-8 shadow-sm">
        <div className="border-b border-line pb-4 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-reel">
            Akses Terbatas
          </span>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-ink">
            Backstage Bioskop
          </h1>
          <p className="mt-1 text-xs text-reel">
            Panel Kurator & Manajer Pemutaran
          </p>
        </div>

        <form className="mt-6 space-y-4">
          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Email Pengguna
            </label>
            <input
              type="email"
              required
              defaultValue="kurator@bioskopmini.id"
              placeholder="kurator@bioskopmini.id"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Link
              href="/admin"
              className="flex w-full items-center justify-center border border-ink bg-ink py-2 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-transparent hover:text-ink"
            >
              Masuk Panel
            </Link>
          </div>
        </form>

        <div className="mt-6 border-t border-line pt-4 text-center">
          <p className="text-[11px] text-reel">
            Sistem pengamanan sesi aktif akan diimplementasikan pada modul
            autentikasi server.
          </p>
        </div>
      </div>
    </div>
  );
}
