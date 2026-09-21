import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.ticket.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.showtime.deleteMany();
  await prisma.film.deleteMany();

  // -------------------------------------------------------------
  // Kategori: Film Panjang (Program: Sinema Sorot - SOROT)
  // -------------------------------------------------------------
  const driveMyCar = await prisma.film.create({
    data: {
      slug: "drive-my-car",
      title: "Drive My Car",
      originalTitle: "ドライブ・マイ・カー (Doraibu mai kā)",
      synopsis:
        "Dua tahun setelah kepergian mendadak istrinya, Yusuke Kafuku, seorang aktor dan sutradara teater kawakan, menerima tawaran memimpin pementasan 'Paman Vanya' di Hiroshima. Panitia festival mewajibkannya menggunakan jasa supir pribadi untuk mobil Saab 900 merah kesayangannya, dan menunjuk Misaki Watari, perempuan muda pendiam yang cakap menyetir. Di sepanjang rute pesisir Hiroshima, keheningan kabin mobil perlahan mencair menjadi ruang pengakuan yang intim, mengurai rasa bersalah, duka mendalam, dan misteri hati orang yang paling ia cintai.",
      director: "Ryusuke Hamaguchi",
      durationMinutes: 179,
      rating: "17+",
      genre: "Drama",
      category: "FEATURE",
      programName: "sorot",
      programVol: 1,
      posterUrl: "/posters/drive-my-car.jpg",
      price: 50000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2021,
    },
  });

  const likeFatherLikeSon = await prisma.film.create({
    data: {
      slug: "like-father-like-son",
      title: "Like Father, Like Son",
      originalTitle: "そして父になる (Soshite Chichi ni Naru)",
      synopsis:
        "Ryota Nonomiya adalah seorang arsitek sukses dan perfeksionis yang menjalani kehidupan mapan di Tokyo bersama istrinya, Midori, dan putra semata wayang mereka, Keita. Ketenangan hidup mereka seketika runtuh saat pihak rumah sakit mengabarkan bahwa Keita tertukar saat lahir dengan anak kandung mereka yang kini dibesarkan oleh keluarga Saiki, penjual toko elektronik sederhana. Menghadapi pertemuan berkala antara dua keluarga, Ryota dipaksa menanyai kembali makna sejati seorang ayah.",
      director: "Hirokazu Kore-eda",
      durationMinutes: 121,
      rating: "13+",
      genre: "Drama, Keluarga",
      category: "FEATURE",
      programName: "sorot",
      programVol: 1,
      posterUrl: "/posters/like-father-like-son.jpg",
      price: 45000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2013,
    },
  });

  const aftersun = await prisma.film.create({
    data: {
      slug: "aftersun",
      title: "Aftersun",
      originalTitle: "Aftersun",
      synopsis:
        "Dua puluh tahun setelah liburan musim panas di sebuah resor pesisir Turki pada akhir 1990-an, Sophie dewasa merenungkan kembali memori masa kecilnya bersama sang ayah, Calum. Melalui potongan rekaman kamera MiniDV dan kilas ingatan yang puitis, Sophie berupaya merekonstruksi sosok pria 31 tahun yang ia kenal sebagai ayah penuh kehangatan, sekaligus menyelami kepedihan dan kerapuhan batin yang diam-diam disembunyikan sang ayah di balik senyumnya.",
      director: "Charlotte Wells",
      durationMinutes: 102,
      rating: "13+",
      genre: "Drama",
      category: "FEATURE",
      programName: "sorot",
      programVol: 1,
      posterUrl: "/posters/aftersun.jpg",
      price: 45000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2022,
    },
  });

  // -------------------------------------------------------------
  // Kategori: Film Dokumenter (Program: Rekam Jejak - REKAM)
  // -------------------------------------------------------------
  const eksil = await prisma.film.create({
    data: {
      slug: "eksil",
      title: "Eksil",
      originalTitle: "The Exiles",
      synopsis:
        "Kisah nyata para mahasiswa dan pemuda Indonesia berprestasi yang dikirim belajar ke Uni Soviet, Tiongkok, dan Eropa Timur oleh Presiden Sukarno pada era 1960-an. Saat prahara politik 1965 meletus, paspor mereka dicabut sepihak oleh rezim Orde Baru, memaksa mereka hidup terkatung-katung dalam pengasingan di negeri asing selama puluhan tahun tanpa pernah bisa pulang memeluk keluarga tercinta. Film pemenang Film Dokumenter Panjang Terbaik Festival Film Indonesia (FFI) 2023.",
      director: "Lola Amaria",
      durationMinutes: 119,
      rating: "17+",
      genre: "Dokumenter, Sejarah",
      category: "DOCUMENTARY",
      programName: "rekam",
      programVol: 1,
      posterUrl: "/posters/eksil.jpg",
      price: 40000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2022,
    },
  });

  const senyap = await prisma.film.create({
    data: {
      slug: "the-look-of-silence",
      title: "The Look of Silence",
      originalTitle: "Senyap",
      synopsis:
        "Adi Rukun, seorang juru periksa kacamata (optometris) sederhana di pedesaan Sumatera Utara, memberanikan diri menemui dan menguji penglihatan para algojo pembantaian massal 1965 yang bertanggung jawab langsung atas pembunuhan tragis kakak kandungnya, Ramli. Di balik alat periksa mata yang presisi, percakapan sunyi namun menusuk tulang terjadi antara keluarga korban dan para pelaku yang masih memegang kuasa. Mahakarya dokumenter nomine Academy Award (Oscar) dan pemenang Grand Jury Prize Venice Film Festival.",
      director: "Joshua Oppenheimer",
      durationMinutes: 98,
      rating: "17+",
      genre: "Dokumenter, Kemanusiaan",
      category: "DOCUMENTARY",
      programName: "rekam",
      programVol: 1,
      posterUrl: "/posters/the-look-of-silence.jpg",
      price: 40000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2014,
    },
  });

  // -------------------------------------------------------------
  // Kategori: Film Pendek (Program: Kisah Singkat - SINGKAT)
  // -------------------------------------------------------------
  const tilik = await prisma.film.create({
    data: {
      slug: "tilik",
      title: "Tilik",
      originalTitle: "Tilik (The Connoisseur)",
      synopsis:
        "Rombongan ibu-ibu desa dari pelosok Bantul menaiki bak truk terbuka milik Gotrek untuk menjenguk (tilik) Bu Lurah yang dirawat di rumah sakit kota. Di sepanjang rute jalanan berliku, Bu Tejo memantik obrolan penuh intrik, celetukan tajam, dan gosip seru mengenai Dian, perempuan kembang desa yang digunjingkan warga. Fenomena kultural film pendek Indonesia paling legendaris karya Ravacana Films yang meraih Piala Maya.",
      director: "Wahyu Agung Prasetyo",
      durationMinutes: 32,
      rating: "13+",
      genre: "Komedi, Drama Pendek",
      category: "SHORT",
      programName: "singkat",
      programVol: 1,
      posterUrl: "/posters/tilik.jpg",
      price: 30000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2018,
    },
  });

  const lemantun = await prisma.film.create({
    data: {
      slug: "lemantun",
      title: "Lemantun",
      originalTitle: "Lemantun (The Wardrobe)",
      synopsis:
        "Seorang ibu sepuh di Yogyakarta mengumpulkan kelima anak kandungnya yang telah beranjak dewasa dan berkeluarga untuk membagikan warisan unik keluarga: bukan tanah, rumah, atau uang perhiasan, melainkan masing-masing satu lemari kayu jati kuno (lemantun) peninggalan masa lalu yang sarat kenangan. Melalui tatapan polos dan ketulusan anak ketiga yang belum mapan, film pendek karya legendaris Wregas Bhanuteja ini mengurai makna mendalam tentang arti keluarga dan warisan sejati.",
      director: "Wregas Bhanuteja",
      durationMinutes: 21,
      rating: "13+",
      genre: "Drama Keluarga Pendek",
      category: "SHORT",
      programName: "singkat",
      programVol: 1,
      posterUrl: "/posters/lemantun.jpg",
      price: 30000,
      isNowShowing: true,
      isComingSoon: false,
      releaseYear: 2014,
    },
  });

  // -------------------------------------------------------------
  // Jadwal Tayang (Showtimes)
  // -------------------------------------------------------------
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
  await prisma.showtime.create({
    data: {
      filmId: likeFatherLikeSon.id,
      startTime: lflsShow1,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 45000,
    },
  });

  // Jadwal Aftersun
  const aftShow1 = new Date(now);
  aftShow1.setHours(21, 15, 0, 0);
  await prisma.showtime.create({
    data: {
      filmId: aftersun.id,
      startTime: aftShow1,
      auditorium: "Layar Utama",
      capacity: 24,
      priceOverride: 45000,
    },
  });

  // Jadwal Eksil (Dokumenter)
  const eksilShow1 = new Date(now);
  eksilShow1.setHours(14, 0, 0, 0);
  const eksilShow2 = new Date(now);
  eksilShow2.setHours(18, 0, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: eksil.id,
      startTime: eksilShow1,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 40000,
    },
  });

  await prisma.showtime.create({
    data: {
      filmId: eksil.id,
      startTime: eksilShow2,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 40000,
    },
  });

  // Jadwal Senyap / The Look of Silence (Dokumenter)
  const senyapShow1 = new Date(now);
  senyapShow1.setHours(20, 30, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: senyap.id,
      startTime: senyapShow1,
      auditorium: "Layar Studio",
      capacity: 24,
      priceOverride: 40000,
    },
  });

  // Jadwal Tilik (Film Pendek)
  const tilikShow1 = new Date(now);
  tilikShow1.setHours(13, 30, 0, 0);
  const tilikShow2 = new Date(now);
  tilikShow2.setHours(17, 15, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: tilik.id,
      startTime: tilikShow1,
      auditorium: "Ruang Pendek",
      capacity: 20,
      priceOverride: 30000,
    },
  });

  await prisma.showtime.create({
    data: {
      filmId: tilik.id,
      startTime: tilikShow2,
      auditorium: "Ruang Pendek",
      capacity: 20,
      priceOverride: 30000,
    },
  });

  // Jadwal Lemantun (Film Pendek)
  const lemantunShow1 = new Date(now);
  lemantunShow1.setHours(15, 0, 0, 0);
  const lemantunShow2 = new Date(now);
  lemantunShow2.setHours(19, 0, 0, 0);

  await prisma.showtime.create({
    data: {
      filmId: lemantun.id,
      startTime: lemantunShow1,
      auditorium: "Ruang Pendek",
      capacity: 20,
      priceOverride: 30000,
    },
  });

  await prisma.showtime.create({
    data: {
      filmId: lemantun.id,
      startTime: lemantunShow2,
      auditorium: "Ruang Pendek",
      capacity: 20,
      priceOverride: 30000,
    },
  });

  // -------------------------------------------------------------
  // Sample Booking
  // -------------------------------------------------------------
  const budiUser = await prisma.user.findFirst({
    where: { email: "budi@example.com" },
  });

  const sampleBooking = await prisma.booking.create({
    data: {
      bookingCode: "BM-SOROT-VOL1-01",
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
      ticketCode: "TKT-SOROT-01",
      bookingId: sampleBooking.id,
      showtimeId: dmcEvening.id,
      price: 50000,
    },
  });

  await prisma.ticket.create({
    data: {
      ticketCode: "TKT-SOROT-02",
      bookingId: sampleBooking.id,
      showtimeId: dmcEvening.id,
      price: 50000,
    },
  });

  console.log("Database seeded successfully with 7 films and showtimes!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
