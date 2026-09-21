import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1">
        {/* Header with Warm White Base & Cinema Ambient Accents */}
        <section className="relative overflow-hidden border-b border-line py-10 sm:py-16 md:py-24">
          <div className="pointer-events-none absolute -top-20 -left-10 h-80 w-80 rounded-full bg-[#1D99DE]/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-10 right-10 h-80 w-80 rounded-full bg-[#F49924]/12 blur-[100px]" />

          <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#D21871]" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#D21871]">
                Tentang Kami
              </span>
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-6xl break-words">
              Bioskop Mini Cikini
            </h1>
            <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-ink/80">
              Sebuah ruang pemutaran film alternatif di jantung Jakarta. Kami
              hadir untuk menghidupkan kembali tradisi menonton bersama yang
              intim, menghargai setiap detik karya gambar bergerak.
            </p>
          </div>
        </section>

        {/* Narrative & Philosophy */}
        <section className="border-b border-line py-10 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  Bukan Sekadar Layar
                </h2>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1277B0]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#1D99DE]" />
                  <span>Filosofi Kurasi</span>
                </div>
              </div>
              <div className="space-y-4 text-sm leading-relaxed text-ink/85 md:col-span-8">
                <p>
                  Bioskop Mini didirikan pada tahun 2024 sebagai respon terhadap
                  menipisnya ruang putar untuk film-film non-arus utama di kota
                  besar. Kami percaya bahwa setiap karya film mandiri,
                  dokumenter, maupun arsip sinema masa lampau berhak ditonton
                  dalam kondisi audio visual yang layak dan tanpa distraksi.
                </p>
                <p>
                  Dengan hanya 24 kursi, kami menolak pengalaman bioskop massal
                  yang seragam. Di sini, penonton dan pembuat film berbagi ruang
                  yang dekat, mendiskusikan apa yang baru saja disaksikan, serta
                  merasakan kembali magisnya ruang gelap dengan sorot proyektor.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Specs & Space */}
        <section className="border-b border-line py-10 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  Spesifikasi Ruang
                </h2>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-xs font-semibold text-[#A6610A]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F49924]" />
                  <span>Auditorium Layar Satu</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:col-span-8">
                <div className="border border-line bg-white p-5 sm:p-6 shadow-warm">
                  <span className="border border-[#F49924]/30 bg-[#F49924]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#A6610A]">
                    Kapasitas
                  </span>
                  <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                    24 Kursi
                  </h3>
                  <p className="mt-2 text-xs text-reel leading-relaxed">
                    Formasi 4 baris (A sampai D) dengan jarak kaki lapang dan
                    sudut pandang optimal ke layar dari setiap kursi.
                  </p>
                </div>

                <div className="border border-line bg-white p-5 sm:p-6 shadow-warm">
                  <span className="border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#1277B0]">
                    Proyeksi
                  </span>
                  <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                    DCI 4K & 35mm
                  </h3>
                  <p className="mt-2 text-xs text-reel leading-relaxed">
                    Sistem pemutaran digital standar industri DCI beresolusi 4K,
                    didukung unit proyektor 35mm untuk program arsip khusus.
                  </p>
                </div>

                <div className="border border-line bg-white p-5 sm:p-6 shadow-warm">
                  <span className="border border-[#D21871]/30 bg-[#D21871]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#D21871]">
                    Tata Suara
                  </span>
                  <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                    7.1 Surround
                  </h3>
                  <p className="mt-2 text-xs text-reel leading-relaxed">
                    Ruang terisolasi akustik penuh dengan kalibrasi suara presisi
                    untuk kejernihan dialog dan kedalaman skor musik.
                  </p>
                </div>

                <div className="border border-line bg-white p-5 sm:p-6 shadow-warm">
                  <span className="border border-[#1D99DE]/30 bg-[#1D99DE]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#1277B0]">
                    Tiket & Akses
                  </span>
                  <h3 className="mt-2.5 font-display text-xl sm:text-2xl font-bold text-ink">
                    Digital QR Pass
                  </h3>
                  <p className="mt-2 text-xs text-reel leading-relaxed">
                    Pemesanan langsung tanpa antre fisik, konfirmasi instan
                    lewat QRIS, dan pemindaian cepat di pintu masuk.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* House Rules */}
        <section className="py-10 sm:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-8 md:gap-12 md:grid-cols-12">
              <div className="md:col-span-4">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-ink">
                  Tata Tertib
                </h2>
                <div className="mt-2 flex items-center gap-1.5 font-mono text-xs font-semibold text-reel">
                  <span>Kenyamanan Bersama</span>
                </div>
              </div>
              <div className="md:col-span-8 bg-white border border-line p-5 sm:p-6 shadow-warm">
                <ol className="space-y-4 text-sm leading-relaxed text-ink/85">
                  <li className="flex gap-4 border-b border-line pb-3">
                    <span className="font-mono font-bold text-[#1D99DE]">01</span>
                    <span>
                      Pintu auditorium dibuka 15 menit sebelum waktu pemutaran.
                      Tidak ada pemutaran iklan komersial sebelum film.
                    </span>
                  </li>
                  <li className="flex gap-4 border-b border-line pb-3">
                    <span className="font-mono font-bold text-[#F49924]">02</span>
                    <span>
                      Harap menonaktifkan suara telepon genggam atau mengubah ke
                      mode getar sebelum memasuki ruangan.
                    </span>
                  </li>
                  <li className="flex gap-4 border-b border-line pb-3">
                    <span className="font-mono font-bold text-[#D21871]">03</span>
                    <span>
                      Keterlambatan lebih dari 10 menit setelah pemutaran dimulai
                      tidak diperkenankan masuk guna menjaga fokus penonton lain.
                    </span>
                  </li>
                  <li className="flex gap-4">
                    <span className="font-mono font-bold text-ink">04</span>
                    <span>
                      Dilarang melakukan perekaman dalam bentuk apapun selama
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
