import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-paper text-ink">
      {/* Backstage Utilitarian Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-line bg-paper p-6 flex flex-col justify-between">
        <div>
          <div className="border-b border-line pb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-reel">
              Backstage Panel
            </span>
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
              BIOSKOP MINI
            </h2>
          </div>

          <nav className="mt-8 space-y-1 text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center px-3 py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Ringkasan Operasional
            </Link>
            <Link
              href="/admin/films"
              className="flex items-center px-3 py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Katalog & Kurasi Film
            </Link>
            <Link
              href="/admin/schedules"
              className="flex items-center px-3 py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Jadwal Pemutaran
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center px-3 py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Pemesanan & Pendapatan
            </Link>
          </nav>
        </div>

        <div className="border-t border-line pt-4 text-xs">
          <div className="text-reel">
            Masuk sebagai:
            <span className="block font-medium text-ink">
              kurator@bioskopmini.id
            </span>
          </div>
          <Link
            href="/admin/login"
            className="mt-3 block text-reel underline hover:text-ink"
          >
            Keluar Sesi
          </Link>
        </div>
      </aside>

      {/* Main Backstage Content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
