import { NextResponse } from "next/server";
import { processPaymentWebhook, verifyDuitkuSignature } from "@/lib/payment";

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let payload: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        payload[key] = value.toString();
      });
    } else {
      payload = await request.json().catch(() => ({}));
    }

    const orderId =
      payload.merchantOrderId ||
      payload.order_id ||
      payload.orderId;

    const resultCode =
      payload.resultCode ||
      payload.transaction_status ||
      payload.transactionStatus ||
      payload.status;

    if (!orderId || !resultCode) {
      return NextResponse.json(
        { error: "orderId / merchantOrderId dan resultCode wajib disertakan." },
        { status: 400 }
      );
    }

    if (payload.signature && payload.merchantCode && payload.amount) {
      const isValid = verifyDuitkuSignature({
        merchantCode: payload.merchantCode,
        amount: payload.amount,
        merchantOrderId: orderId,
        signature: payload.signature,
      });

      if (!isValid) {
        return NextResponse.json(
          { error: "Signature Duitku tidak valid." },
          { status: 401 }
        );
      }
    }

    const result = await processPaymentWebhook(orderId, resultCode);

    return NextResponse.json({
      status: "OK",
      orderId,
      paymentStatus: result.status || result.booking.paymentStatus,
      paidAt: result.booking.paidAt,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Gagal memproses webhook.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
