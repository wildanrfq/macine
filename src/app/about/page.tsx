import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="relative border-b border-line py-12 sm:py-16 md:py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D21871]" />
              <span className="border border-[#D21871]/40 bg-[#D21871]/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#D21871] font-semibold">
                Tentang Kami
              </span>
            </div>
            <h1 className="mt-4 font-serif text-3xl font-medium tracking-tight text-ink sm:text-5xl md:text-6xl break-words">
              Bioskop Mini Cikini
            </h1>
            <p className="mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-reel">
              Sebuah ruang pemutaran film alternatif di jantung Jakarta. Kami
              hadir untuk menghidupkan kembali tradisi menonton bersama yang
              intim, menghargai setiap detik karya gambar bergerak.
            </p>
          </div>
        </section>

        {/* Narrative & Philosophy */}
        <section className="border-b border-line py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
                  Bukan Sekadar Layar
                </h2>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1277B0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1D99DE]" />
                  <span>Filosofi Kurasi</span>
                </div>
              </div>
              <div className="space-y-4 text-sm sm:text-base leading-relaxed text-ink/85 md:col-span-8">
                <p>
                  Bioskop Mini didirikan pada tahun 2024 sebagai respon terhadap
                  menipisnya ruang putar untuk film-film non-arus utama di kota
                  besar. Kami percaya bahwa setiap karya film mandiri,
                  dokumenter, maupun arsip sinema masa lampau berhak ditonton
                  dalam kondisi audio visual yang layak dan tanpa distraksi.
                </p>
                <p>
                  Dengan kapasitas 24 kursi, kami menolak pengalaman bioskop massal
                  yang seragam. Di sini, penonton dan pembuat film berbagi ruang
                  yang dekat, mendiskusikan apa yang baru saja disaksikan, serta
                  merasakan kembali magisnya ruang gelap dengan sorot proyektor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs & Space */}
        <section className="border-b border-line py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
                  Spesifikasi Ruang
                </h2>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#A6610A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                  <span>Auditorium Layar Satu</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:col-span-8">
                <div className="border border-line bg-paper-card p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                  <span className="border border-[#F49924]/40 bg-[#F49924]/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#A6610A] font-semibold">
                    Kapasitas
                  </span>
                  <h3 className="mt-3 font-serif text-xl sm:text-2xl font-medium text-ink">
                    24 Kursi
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-reel leading-relaxed">
                    Formasi 4 baris (A sampai D) dengan jarak kaki lapang dan
                    sudut pandang optimal ke layar dari setiap kursi.
                  </p>
                </div>

                <div className="border border-line bg-paper-card p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                  <span className="border border-[#1D99DE]/40 bg-[#1D99DE]/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#1277B0] font-semibold">
                    Proyeksi
                  </span>
                  <h3 className="mt-3 font-serif text-xl sm:text-2xl font-medium text-ink">
                    DCI 4K & 35mm
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-reel leading-relaxed">
                    Sistem pemutaran digital standar industri DCI beresolusi 4K,
                    didukung unit proyektor 35mm untuk program arsip khusus.
                  </p>
                </div>

                <div className="border border-line bg-paper-card p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                  <span className="border border-[#D21871]/40 bg-[#D21871]/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#D21871] font-semibold">
                    Tata Suara
                  </span>
                  <h3 className="mt-3 font-serif text-xl sm:text-2xl font-medium text-ink">
                    7.1 Surround
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-reel leading-relaxed">
                    Ruang terisolasi akustik penuh dengan kalibrasi suara presisi
                    untuk kejernihan dialog dan kedalaman skor musik.
                  </p>
                </div>

                <div className="border border-line bg-paper-card p-5 sm:p-6 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                  <span className="border border-[#1D99DE]/40 bg-[#1D99DE]/10 px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-wider text-[#1277B0] font-semibold">
                    Tiket & Akses
                  </span>
                  <h3 className="mt-3 font-serif text-xl sm:text-2xl font-medium text-ink">
                    Digital QR Pass
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-reel leading-relaxed">
                    Pemesanan langsung tanpa antre fisik, konfirmasi instan
                    lewat QRIS, dan pemindaian cepat di pintu masuk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* House Rules */}
        <section className="py-12 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink">
                  Tata Tertib
                </h2>
                <div className="mt-2 font-mono text-xs uppercase tracking-wider text-reel">
                  Kenyamanan Bersama
                </div>
              </div>
              <div className="md:col-span-8 bg-paper-card border border-line p-6 sm:p-8 shadow-[3px_3px_0px_0px_rgba(18,17,16,0.08)]">
                <ol className="space-y-4 text-sm leading-relaxed text-ink/85">
                  <li className="flex gap-4 border-b border-line pb-4">
                    <span className="font-mono font-bold text-[#1D99DE]">01</span>
                    <span>
                      Pintu auditorium dibuka 15 menit sebelum waktu pemutaran.
                      Tidak ada pemutaran iklan komersial sebelum film.
                    </span>
                  </li>
                  <li className="flex gap-4 border-b border-line pb-4">
                    <span className="font-mono font-bold text-[#F49924]">02</span>
                    <span>
                      Harap menonaktifkan suara telepon genggam atau mengubah ke
                      mode getar sebelum memasuki ruangan.
                    </span>
                  </li>
                  <li className="flex gap-4 border-b border-line pb-4">
                    <span className="font-mono font-bold text-[#D21871]">03</span>
                    <span>
                      Keterlambatan lebih dari 10 menit setelah pemutaran dimulai
                      tidak diperkenankan masuk guna menjaga fokus penonton lain.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono font-bold text-ink">04</span>
                    <span>
                      Dilarang melakukan perekaman gambar maupun audio selama
                      film berlangsung.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
