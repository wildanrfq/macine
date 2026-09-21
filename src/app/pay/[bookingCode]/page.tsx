import { notFound } from "next/navigation";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import PayClient from "./PayClient";

export const dynamic = "force-dynamic";

interface PayPageProps {
  params: Promise<{ bookingCode: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const { bookingCode } = await params;

  const booking = await prisma.booking.findUnique({
    where: { bookingCode },
    include: {
      showtime: {
        include: { film: true },
      },
      tickets: true,
    },
  });

  if (!booking) {
    notFound();
  }

  // Cek apakah waktu pembayaran telah melewati 15 menit
  if (booking.paymentStatus === "PENDING") {
    const now = new Date();
    const isExpired = booking.expiresAt
      ? new Date(booking.expiresAt) < now
      : Date.now() - new Date(booking.createdAt).getTime() > 15 * 60 * 1000;

    if (isExpired) {
      await prisma.$transaction(async (tx) => {
        await tx.ticket.deleteMany({
          where: { bookingId: booking.id },
        });
        await tx.booking.update({
          where: { id: booking.id },
          data: { paymentStatus: "EXPIRED" },
        });
      });
      booking.paymentStatus = "EXPIRED";
    }
  }

  const initialBooking = {
    id: booking.id,
    bookingCode: booking.bookingCode,
    customerName: booking.customerName,
    customerEmail: booking.customerEmail,
    customerPhone: booking.customerPhone,
    ticketCount: booking.ticketCount,
    totalAmount: booking.totalAmount,
    paymentStatus: booking.paymentStatus,
    qrisString: booking.qrisString,
    expiresAt: booking.expiresAt ? booking.expiresAt.toISOString() : null,
    filmTitle: booking.showtime.film.title,
    filmId: booking.showtime.film.id,
    posterUrl: booking.showtime.film.posterUrl,
    auditorium: booking.showtime.auditorium,
    startTime: booking.showtime.startTime.toISOString(),
    ticketCodes: booking.tickets.map((t) => t.ticketCode),
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />
      <main className="flex-1">
        <PayClient initialBooking={initialBooking} />
      </main>
      <Footer />
    </div>
  );
}
