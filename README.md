# Bioskop Mini

Platform digital web untuk sinema independen: kurasi film alternatif, pemesanan tiket online dengan pembayaran QRIS otomatis, dan e-tiket digital dengan kode QR untuk akses masuk auditorium.

---

## Fitur Utama

### 1. Pengalaman Penonton (Publik)
- **Katalog & Kurasi Film**: Daftar film yang sedang tayang (*Now Showing*) dan segera hadir (*Coming Soon*) dengan informasi detail, sinopsis kuratorial, durasi, genre, dan rating usia.
- **Detail Film & Jadwal**: Halaman khusus untuk setiap film dengan informasi jadwal pemutaran (*showtimes*), kapasitas auditorium (24 kursi eksklusif), dan harga tiket.
- **Pemesanan Tiket Online**:
  - Pemilihan jumlah tiket dengan validasi ketersediaan kapasitas kursi secara real-time.
  - Formulir data pemesan (terintegrasi otomatis bagi pengguna yang telah login).
  - Pembayaran instan via **QRIS** (mendukung m-banking dan e-wallet nasional).
  - Pengecekan status pembayaran otomatis via webhook dan polling real-time.
- **E-Tiket & Dashboard**:
  - Akses riwayat pemesanan dan tiket aktif.
  - Kode QR tiket digital yang dapat dipindai langsung oleh petugas di pintu masuk auditorium.
- **Autentikasi Pengguna**: Fitur registrasi dan login akun penonton untuk menyimpan seluruh riwayat tiket.

### 2. Panel Pengelola (Admin Backstage)
- **Ringkasan Operasional**: Overview pendapatan, jumlah film aktif, total jadwal, dan tiket terjual.
- **Manajemen Film**: Tambah dan kelola judul film, sinopsis, sutradara, durasi, harga, dan poster.
- **Manajemen Jadwal**: Atur tanggal, jam tayang, auditorium, dan kapasitas kursi per sesi pemutaran.
- **Manajemen Booking**: Pantau seluruh transaksi masuk, status pembayaran (*PENDING*, *PAID*, *EXPIRED*), dan daftar tiket.

---

## Arsitektur & Teknologi

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) dengan palet monokromatik hangat (*ink & paper*)
- **Database & ORM**: PostgreSQL via [Prisma ORM](https://www.prisma.io/)
- **Pembayaran**: QRIS Gateway via [Duitku](https://www.duitku.com/) (Sandbox & Production ready)
- **Generasi QR Code**: [node-qrcode](https://github.com/soldair/node-qrcode)
- **Performa & Caching**: Incremental Static Regeneration (ISR) dengan background prefetching di Vercel Edge CDN

---

## Struktur Direktori

```text
macine/
├── prisma/
│   ├── schema.prisma       # Skema database Prisma (PostgreSQL)
│   └── seed.ts             # Data awal (film kurasi, jadwal, tiket sampel)
├── public/
│   └── posters/            # Aset poster film resmi
├── src/
│   ├── app/
│   │   ├── (public)/       # Halaman utama, katalog, detail film, tentang
│   │   ├── admin/          # Panel backstage admin (film, jadwal, booking)
│   │   ├── api/            # Route handlers (auth, bookings, payment webhook)
│   │   ├── book/           # Alur pemesanan tiket 3-langkah & pembayaran QRIS
│   │   └── dashboard/      # Dashboard tiket digital penonton
│   ├── components/         # Komponen modular UI (Navbar, Footer, QrCodeVisual)
│   └── lib/                # Konfigurasi Prisma, Autentikasi, dan Layanan Pembayaran
└── .env.example            # Template environment variables
```

---

## Memulai Pengembangan Lokal

### 1. Prasyarat
- Node.js versi 20+
- Database PostgreSQL (misalnya melalui Neon, Supabase, atau Vercel Postgres)

### 2. Instalasi Dependensi
```bash
git clone git@github.com:wildanrfq/macine.git
cd macine
npm install
```

### 3. Konfigurasi Environment Variables
Salin file `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Sesuaikan nilai variabel di `.env`:
```env
# Database PostgreSQL
DATABASE_URL="postgres://user:password@host:5432/dbname?sslmode=require"

# Duitku Payment Gateway
DUITKU_MERCHANT_CODE="KODE_MERCHANT_SANDBOX_ANDA"
DUITKU_API_KEY="API_KEY_SANDBOX_ANDA"
DUITKU_IS_PRODUCTION="false"
DUITKU_CALLBACK_URL="https://domain-anda.com/api/payment/webhook"
DUITKU_PAYMENT_METHOD="NQ"
```

### 4. Migrasi Database & Seed Data
Sinkronkan tabel ke database dan isi data film awal:
```bash
# Sinkronkan skema ke PostgreSQL
npx prisma db push

# Isi data awal film dan jadwal
npm run db:seed
```

### 5. Jalankan Development Server
```bash
npm run dev
```
Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

Untuk membuka GUI database visual, jalankan:
```bash
npx prisma studio
```

---

## Deployment ke Vercel

Proyek ini telah dikonfigurasi untuk deployment instan di platform Vercel:

1. Import repository `wildanrfq/macine` di [Vercel Dashboard](https://vercel.com/new).
2. Di bagian **Environment Variables**, tambahkan:
   - `DATABASE_URL` (URL koneksi Vercel Postgres / Neon Anda)
   - `DUITKU_MERCHANT_CODE`
   - `DUITKU_API_KEY`
   - `DUITKU_IS_PRODUCTION` (`false` untuk Sandbox, `true` untuk Production)
   - `DUITKU_CALLBACK_URL` (`https://<domain-vercel>.vercel.app/api/payment/webhook`)
   - `DUITKU_PAYMENT_METHOD` (`NQ`)
3. Klik **Deploy**. Script `postinstall` akan secara otomatis membuat client Prisma saat build berlangsung.

---

## Lisensi & Hak Cipta
Hak cipta © 2026 Bioskop Mini. Seluruh hak cipta dilindungi undang-undang.
