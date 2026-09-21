import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import prisma from "@/lib/prisma";
import BookingClient from "./BookingClient";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface BookingPageProps {
  params: Promise<{ showtimeId: string }>;
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { showtimeId } = await params;

  const [showtime, user] = await Promise.all([
    prisma.showtime.findUnique({
      where: { id: showtimeId },
      include: {
        film: true,
        tickets: {
          where: {
            booking: {
              paymentStatus: { in: ["PENDING", "PAID"] },
            },
          },
          select: { id: true },
        },
      },
    }),
    getCurrentUser(),
  ]);

  if (!showtime) {
    notFound();
  }

  const activeTicketsCount = showtime.tickets.length;
  const remainingTickets = Math.max(0, showtime.capacity - activeTicketsCount);

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <Navbar />

      <main className="flex-1 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <Link
            href={`/films/${showtime.film.id}`}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-[#1D99DE] hover:text-[#0F6696]"
          >
            ← Kembali ke Detail Film
          </Link>

          <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Pemesanan Tiket
          </h1>

          <div className="mt-8">
            <BookingClient
              showtime={{
                id: showtime.id,
                startTime: showtime.startTime.toISOString(),
                auditorium: showtime.auditorium,
                capacity: showtime.capacity,
                price: showtime.priceOverride ?? showtime.film.price,
                film: {
                  id: showtime.film.id,
                  title: showtime.film.title,
                  posterUrl: showtime.film.posterUrl,
                  durationMinutes: showtime.film.durationMinutes,
                  rating: showtime.film.rating,
                },
              }}
              remainingTickets={remainingTickets}
              initialUser={
                user
                  ? {
                      name: user.name,
                      email: user.email,
                      phone: user.phone,
                    }
                  : null
              }
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
