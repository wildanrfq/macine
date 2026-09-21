import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-paper text-ink">
      {/* Backstage Utilitarian Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-b md:border-b-0 md:border-r border-line bg-paper p-4 sm:p-6 flex flex-col justify-between">
        <div>
          <div className="border-b border-line pb-3 sm:pb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-reel">
              Backstage Panel
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink">
              BIOSKOP MINI
            </h2>
          </div>

          <nav className="mt-4 sm:mt-8 flex flex-wrap md:flex-col gap-1 text-xs sm:text-sm font-medium">
            <Link
              href="/admin"
              className="flex items-center px-3 py-1.5 sm:py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Ringkasan Operasional
            </Link>
            <Link
              href="/admin/films"
              className="flex items-center px-3 py-1.5 sm:py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Katalog & Kurasi Film
            </Link>
            <Link
              href="/admin/schedules"
              className="flex items-center px-3 py-1.5 sm:py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Jadwal Pemutaran
            </Link>
            <Link
              href="/admin/bookings"
              className="flex items-center px-3 py-1.5 sm:py-2 text-ink border border-transparent hover:border-line hover:bg-line/20"
            >
              Pemesanan & Pendapatan
            </Link>
          </nav>
        </div>

        <div className="border-t border-line pt-3 sm:pt-4 text-xs mt-4 md:mt-0 flex flex-row md:flex-col justify-between md:justify-start items-center md:items-start">
          <div className="text-reel">
            <span className="hidden md:inline">Masuk sebagai: </span>
            <span className="font-medium text-ink">
              kurator@bioskopmini.id
            </span>
          </div>
          <Link
            href="/admin/login"
            className="md:mt-3 block text-reel underline hover:text-ink"
          >
            Keluar Sesi
          </Link>
        </div>
      </aside>

      {/* Main Backstage Content */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8">{children}</main>
    </div>
  );
}
