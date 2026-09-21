import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.film.deleteMany();

  const driveMyCar = await prisma.film.create({
    data: {
      title: "Drive My Car",
      originalTitle: "ドライブ・マイ・カー (Doraibu mai kā)",
      synopsis:
        "Dua tahun setelah kepergian mendadak istrinya, Yusuke Kafuku, seorang aktor dan sutradara teater kawakan, menerima tawaran memimpin pementasan 'Paman Vanya' di Hiroshima. Panitia festival mewajibkannya menggunakan jasa supir pribadi untuk mobil Saab 900 merah kesayangannya, dan menunjuk Misaki Watari, perempuan muda pendiam yang cakap menyetir. Di sepanjang rute pesisir Hiroshima, keheningan kabin mobil perlahan mencair menjadi ruang pengakuan yang intim, mengurai rasa bersalah, duka mendalam, dan misteri hati orang yang paling ia cintai.",
      director: "Ryusuke Hamaguchi",
      durationMinutes: 179,
      rating: "17+",
      genre: "Drama",
      posterUrl: "/posters/drive-my-car.jpg",
      price: 50000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2021,
    },
  });

  const likeFatherLikeSon = await prisma.film.create({
    data: {
      title: "Like Father, Like Son",
      originalTitle: "そして父になる (Soshite Chichi ni Naru)",
      synopsis:
        "Ryota Nonomiya adalah seorang arsitek sukses dan perfeksionis yang menjalani kehidupan mapan di Tokyo bersama istrinya, Midori, dan putra semata wayang mereka, Keita. Ketenangan hidup mereka seketika runtuh saat pihak rumah sakit mengabarkan bahwa Keita tertukar saat lahir dengan anak kandung mereka yang kini dibesarkan oleh keluarga Saiki, penjual toko elektronik sederhana. Menghadapi pertemuan berkala antara dua keluarga, Ryota dipaksa menanyai kembali makna sejati seorang ayah—apakah keluarga ditentukan oleh pertalian darah atau oleh waktu dan kasih sayang yang dirajut bersama?",
      director: "Hirokazu Kore-eda",
      durationMinutes: 121,
      rating: "13+",
      genre: "Drama, Keluarga",
      posterUrl: "/posters/like-father-like-son.jpg",
      price: 45000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2013,
    },
  });

  const aftersun = await prisma.film.create({
    data: {
      title: "Aftersun",
      originalTitle: "Aftersun",
      synopsis:
        "Dua puluh tahun setelah liburan musim panas di sebuah resor pesisir Turki pada akhir 1990-an, Sophie dewasa merenungkan kembali memori masa kecilnya bersama sang ayah, Calum. Melalui potongan rekaman kamera MiniDV dan kilas ingatan yang puitis, Sophie berupaya merekonstruksi sosok pria 31 tahun yang ia kenal sebagai ayah penuh kehangatan, sekaligus menyelami kepedihan dan kerapuhan batin yang diam-diam disembunyikan sang ayah di balik senyumnya. Sebuah ode sinematik yang menyentuh tentang duka, memori, dan cinta yang abadi.",
      director: "Charlotte Wells",
      durationMinutes: 102,
      rating: "13+",
      genre: "Drama",
      posterUrl: "/posters/aftersun.jpg",
      price: 45000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2022,
    },
  });

  const now = new Date();

  // Jadwal Drive My Car
  const dmcShow1 = new Date(now);
  dmcShow1.setHours(15, 30, 0, 0);

  const dmcShow2 = new Date(now);
  dmcShow2.setHours(19, 30, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: driveMyCar.id,
      startTime: dmcShow1,
      auditorium: "Layar Utama",
      capacity: 24,
      priceOverride: 50000,
    },
  });

  const dmcEvening = await prisma.showtime.create({
    data: {
      filmId: driveMyCar.id,
      startTime: dmcShow2,
      auditorium: "Layar Utama",
      capacity: 24,
      priceOverride: 50000,
    },
  });

  // Jadwal Like Father, Like Son
  const lflsShow1 = new Date(now);
  lflsShow1.setHours(16, 15, 0, 0);

  const lflsShow2 = new Date(now);
  lflsShow2.setHours(19, 15, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: likeFatherLikeSon.id,
      startTime: lflsShow1,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 45000,
    },
  });

  await prisma.showtime.create({
    data: {
      filmId: likeFatherLikeSon.id,
      startTime: lflsShow2,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 45000,
    },
  });

  // Jadwal Aftersun
  const aftShow1 = new Date(now);
  aftShow1.setHours(17, 0, 0, 0);

  const aftShow2 = new Date(now);
  aftShow2.setHours(21, 15, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: aftersun.id,
      startTime: aftShow1,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 45000,
    },
  });

  await prisma.showtime.create({
    data: {
      filmId: aftersun.id,
      startTime: aftShow2,
      auditorium: "Layar Utama",
      capacity: 24,
      priceOverride: 45000,
    },
  });

  // Hubungkan sample tiket dengan akun Budi jika ada
  const budiUser = await prisma.user.findFirst({
    where: { email: "budi@example.com" },
  });

  const sampleBooking = await prisma.booking.create({
    data: {
      bookingCode: "BM-DRIVE-2026",
      customerName: budiUser ? budiUser.name : "Raden Arya",
      customerEmail: budiUser ? budiUser.email : "raden.arya@example.com",
      customerPhone: budiUser?.phone || "081234567890",
      userId: budiUser?.id || null,
      showtimeId: dmcEvening.id,
      ticketCount: 2,
      totalAmount: 100000,
      paymentStatus: "PAID",
      paymentMethod: "QRIS",
      paymentGatewayRef: "DK-SETTLED-001",
      paidAt: new Date(),
    },
  });

  await prisma.ticket.create({
    data: {
      ticketCode: "TKT-DRIVE-01",
      bookingId: sampleBooking.id,
      showtimeId: dmcEvening.id,
      price: 50000,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketCode: "TKT-DRIVE-02",
      bookingId: sampleBooking.id,
      showtimeId: dmcEvening.id,
      price: 50000,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
