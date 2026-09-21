import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface StatusRouteProps {
  params: Promise<{ bookingCode: string }>;
}

export async function GET(request: Request, { params }: StatusRouteProps) {
  try {
    const { bookingCode } = await params;

    const booking = await prisma.booking.findUnique({
      where: { bookingCode },
      include: {
        tickets: true,
        showtime: {
          include: { film: true },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Kode pemesanan tidak ditemukan." },
        { status: 404 }
      );
    }

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

    return NextResponse.json({
      bookingCode: booking.bookingCode,
      ticketCount: booking.ticketCount,
      paymentStatus: booking.paymentStatus,
      paidAt: booking.paidAt,
      totalAmount: booking.totalAmount,
      expiresAt: booking.expiresAt,
      filmTitle: booking.showtime.film.title,
      auditorium: booking.showtime.auditorium,
      startTime: booking.showtime.startTime,
      tickets: booking.tickets.map((t) => ({
        ticketCode: t.ticketCode,
        price: t.price,
        isScanned: t.isScanned,
      })),
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal mengambil status.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
