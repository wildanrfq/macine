import Link from "next/link";

export default function NewFilmPage() {
  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/films"
        className="font-mono text-xs text-reel hover:text-ink"
      >
        Kembali ke Daftar Film
      </Link>

      <div className="mt-4 border-b border-line pb-4">
        <span className="font-mono text-xs uppercase text-reel">
          Kurasi Baru
        </span>
        <h1 className="font-display text-3xl font-bold text-ink">
          Tambah Judul Film
        </h1>
      </div>

      <form className="mt-8 space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Judul Film (Indonesia/Distribusi)
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Berdikari Malam"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Judul Asli (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Autonomous Night"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase text-reel">
            Sinopsis Kuratorial
          </label>
          <textarea
            rows={4}
            required
            placeholder="Tuliskan sinopsis singkat dan konteks film..."
            className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Sutradara
            </label>
            <input
              type="text"
              required
              placeholder="Nama Sutradara"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Durasi (Menit)
            </label>
            <input
              type="number"
              required
              placeholder="108"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Klasifikasi Usia
            </label>
            <select className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none">
              <option value="SU">Semua Umur (SU)</option>
              <option value="13+">Remaja (13+)</option>
              <option value="17+">Dewasa (17+)</option>
              <option value="21+">Dewasa 21+</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Genre
            </label>
            <input
              type="text"
              required
              placeholder="Drama, Neo-Noir"
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-xs uppercase text-reel">
              Harga Tiket (IDR)
            </label>
            <input
              type="number"
              required
              defaultValue={45000}
              className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-mono text-xs uppercase text-reel">
            URL Poster Film
          </label>
          <input
            type="url"
            required
            placeholder="https://..."
            className="mt-1 w-full border border-line bg-paper px-3 py-2 text-sm text-ink focus:border-ink focus:outline-none font-mono text-xs"
          />
        </div>

        <div className="flex items-center gap-6 border-t border-line pt-6">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-line text-ink focus:ring-ink"
            />
            <span>Tandai sebagai Sedang Tayang (Now Showing)</span>
          </label>
        </div>

        <div className="flex justify-end gap-3 border-t border-line pt-6">
          <Link
            href="/admin/films"
            className="border border-line px-4 py-2 text-xs font-mono text-reel hover:text-ink"
          >
            Batal
          </Link>
          <button
            type="button"
            className="border border-ink bg-ink px-6 py-2 text-xs font-semibold uppercase tracking-wider text-paper hover:bg-transparent hover:text-ink"
          >
            Simpan Film
          </button>
        </div>
      </form>
    </div>
  );
}
