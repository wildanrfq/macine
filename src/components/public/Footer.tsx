import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-[#FAF8F5] py-14 text-sm text-ink">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1D99DE]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#F49924]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D21871]" />
              <h3 className="font-serif text-2xl font-medium tracking-tight text-ink ml-1">
                BIOSKOP MINI
              </h3>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-reel">
              Ruang putar film independen berkapasitas 24 kursi. Menghadirkan
              karya sineas alternatif, dokumenter terpilih, dan pemutaran arsip
              dalam keintiman sinematik.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-medium">Kunjungan</h4>
            <p className="mt-3 text-sm leading-relaxed text-reel">
              Jl. Cikini Raya No. 42
              <br />
              Jakarta Pusat 10330
              <br />
              Selasa - Minggu, 15:00 - 23:00 WIB
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-wider text-ink font-medium">Navigasi</h4>
            <ul className="mt-3 space-y-2 text-sm text-reel">
              <li>
                <Link href="/films" className="transition-colors hover:text-[#1D99DE]">
                  Daftar Film
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-[#1D99DE]">
                  Tentang Bioskop
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="transition-colors hover:text-[#D21871]">
                  Cek Status Tiket
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between border-t border-line pt-6 text-xs text-reel md:flex-row">
          <p>&copy; 2026 Bioskop Mini. Hak cipta dilindungi.</p>
          <div className="mt-2 flex items-center gap-2 md:mt-0 font-mono text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
            <span>Proyeksi 4K DCP dan tata suara 7.1</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
