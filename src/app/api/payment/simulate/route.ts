import { NextResponse } from "next/server";
import { processPaymentWebhook } from "@/lib/payment";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { bookingCode, status = "settlement" } = body;

    if (!bookingCode) {
      return NextResponse.json(
        { error: "bookingCode diperlukan untuk simulasi." },
        { status: 400 }
      );
    }

    const result = await processPaymentWebhook(bookingCode, status);

    return NextResponse.json({
      success: true,
      message: `Simulasi webhook gateway berhasil dikirim dengan status: ${status}`,
      bookingCode,
      paymentStatus: result.status || result.booking.paymentStatus,
      paidAt: result.booking.paidAt,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Simulasi webhook gagal.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
