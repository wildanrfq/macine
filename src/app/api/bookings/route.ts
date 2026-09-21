import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createQrisCharge, expireOverdueBookings } from "@/lib/payment";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    await expireOverdueBookings();

    const body = await request.json();
    const {
      showtimeId,
      ticketCount,
      customerName,
      customerEmail,
      customerPhone,
    } = body;

    const count = Number.parseInt(ticketCount, 10);

    if (!showtimeId || !count || count < 1) {
      return NextResponse.json(
        { error: "Pilih minimal 1 tiket dan jadwal tayang yang valid." },
        { status: 400 }
      );
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        { error: "Nama, email, dan nomor telepon wajib diisi." },
        { status: 400 }
      );
    }

    const showtime = await prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: { film: true },
    });

    if (!showtime) {
      return NextResponse.json(
        { error: "Jadwal tayang tidak ditemukan." },
        { status: 404 }
      );
    }

    // Tautkan ke akun pengguna jika sedang login atau jika email terdaftar
    const currentUser = await getCurrentUser();
    let userId = currentUser?.id;

    if (!userId) {
      const registeredUser = await prisma.user.findUnique({
        where: { email: customerEmail.trim().toLowerCase() },
        select: { id: true },
      });
      if (registeredUser) {
        userId = registeredUser.id;
      }
    }

    const unitPrice = showtime.priceOverride ?? showtime.film.price;
    const totalAmount = unitPrice * count;

    const programTag = (showtime.film.programName || "sorot").toUpperCase();
    const programVol = showtime.film.programVol || 1;
    const prefix = `BM-${programTag}-VOL${programVol}-`;

    const existingCount = await prisma.booking.count({
      where: {
        bookingCode: {
          startsWith: prefix,
        },
      },
    });

    let seq = existingCount + 1;
    let bookingCode = `${prefix}${seq.toString().padStart(2, "0")}`;

    let isTaken = await prisma.booking.findUnique({ where: { bookingCode } });
    while (isTaken) {
      seq += 1;
      bookingCode = `${prefix}${seq.toString().padStart(2, "0")}`;
      isTaken = await prisma.booking.findUnique({ where: { bookingCode } });
    }

    const qrisData = await createQrisCharge({
      bookingCode,
      totalAmount,
      customerName,
      customerEmail,
      customerPhone,
    });

    const booking = await prisma.$transaction(async (tx) => {
      const activeTicketsCount = await tx.ticket.count({
        where: {
          showtimeId,
          booking: {
            paymentStatus: { in: ["PENDING", "PAID"] },
          },
        },
      });

      const remainingQuota = showtime.capacity - activeTicketsCount;

      if (count > remainingQuota) {
        throw new Error(
          remainingQuota > 0
            ? `Kapasitas tersisa ${remainingQuota} tiket. Permintaan ${count} tiket melebihi batas kuota.`
            : "Tiket untuk jadwal pemutaran ini telah habis terjual."
        );
      }

      const ticketsPayload = Array.from({ length: count }).map((_, idx) => ({
        ticketCode: `TKT-${bookingCode}-${(idx + 1).toString().padStart(2, "0")}`,
        showtimeId,
        price: unitPrice,
      }));

      return await tx.booking.create({
        data: {
          bookingCode,
          customerName,
          customerEmail,
          customerPhone,
          userId: userId || null,
          showtimeId,
          ticketCount: count,
          totalAmount,
          paymentStatus: "PENDING",
          paymentMethod: "QRIS",
          paymentGatewayRef: qrisData.paymentGatewayRef,
          qrisString: qrisData.qrisString,
          expiresAt: qrisData.expiresAt,
          tickets: {
            create: ticketsPayload,
          },
        },
        include: {
          tickets: true,
          showtime: {
            include: { film: true },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        bookingCode: booking.bookingCode,
        ticketCount: booking.ticketCount,
        totalAmount: booking.totalAmount,
        paymentStatus: booking.paymentStatus,
        qrisString: booking.qrisString,
        expiresAt: booking.expiresAt,
        isSimulated: qrisData.isSimulated,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        filmTitle: booking.showtime.film.title,
        auditorium: booking.showtime.auditorium,
        startTime: booking.showtime.startTime,
        ticketCodes: booking.tickets.map((t) => t.ticketCode),
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal memproses pemesanan.";
    const isCapacityError =
      message.includes("Kapasitas tersisa") || message.includes("telah habis");

    return NextResponse.json(
      { error: message },
      { status: isCapacityError ? 409 : 500 }
    );
  }
}
