import crypto from "node:crypto";
import prisma from "@/lib/prisma";

export interface CreateQrisParams {
  bookingCode: string;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export interface QrisResult {
  qrisString: string;
  paymentGatewayRef: string;
  expiresAt: Date;
  isSimulated: boolean;
}

export async function createQrisCharge(params: CreateQrisParams): Promise<QrisResult> {
  const merchantCode = process.env.DUITKU_MERCHANT_CODE;
  const apiKey = process.env.DUITKU_API_KEY;
  const isProduction = process.env.DUITKU_IS_PRODUCTION === "true";
  const paymentMethod = process.env.DUITKU_PAYMENT_METHOD || "SP";
  const callbackUrl = process.env.DUITKU_CALLBACK_URL || "";
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  if (merchantCode && apiKey) {
    const baseUrl = isProduction
      ? "https://passport.duitku.com/webapi/api/merchant/v2/inquiry"
      : "https://sandbox.duitku.com/webapi/api/merchant/v2/inquiry";

    const signatureRaw = `${merchantCode}${params.bookingCode}${params.totalAmount}${apiKey}`;
    const signature = crypto.createHash("md5").update(signatureRaw).digest("hex");

    const payload = {
      merchantCode,
      paymentAmount: params.totalAmount,
      paymentMethod,
      merchantOrderId: params.bookingCode,
      productDetails: `Tiket Bioskop Mini - ${params.bookingCode}`,
      email: params.customerEmail,
      phoneNumber: params.customerPhone,
      customerVaName: params.customerName,
      callbackUrl,
      returnUrl: callbackUrl ? callbackUrl.replace("/api/payment/webhook", "/dashboard") : "",
      signature,
      expiryPeriod: 15,
    };

    try {
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000),
      });

      const data = await response.json();

      if (response.ok && data.statusCode === "00" && data.qrString) {
        return {
          qrisString: data.qrString,
          paymentGatewayRef: data.reference || params.bookingCode,
          expiresAt,
          isSimulated: false,
        };
      }

      console.warn("Duitku inquiry returned non-00 or no qrString, falling back to simulator:", data);
    } catch (err) {
      console.error("Error communicating with Duitku API, using simulator fallback:", err);
    }
  }

  const simulatedRef = `DK-SIM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  const simulatedQrisString = `00020101021226600016ID.CO.BIOSKOPMINI.WWW01189360000201112233440215${params.bookingCode}520458125303360540${params.totalAmount}5802ID5912BIOSKOP MINI6007JAKARTA62210117${params.bookingCode}6304ABCD`;

  return {
    qrisString: simulatedQrisString,
    paymentGatewayRef: simulatedRef,
    expiresAt,
    isSimulated: true,
  };
}

export function verifyDuitkuSignature(payload: {
  merchantCode: string;
  amount: string | number;
  merchantOrderId: string;
  signature?: string;
}): boolean {
  const apiKey = process.env.DUITKU_API_KEY;
  if (!apiKey) return true;

  const raw = `${payload.merchantCode}${payload.amount}${payload.merchantOrderId}${apiKey}`;
  const calculated = crypto.createHash("md5").update(raw).digest("hex");
  return calculated.toLowerCase() === (payload.signature || "").toLowerCase();
}

export async function processPaymentWebhook(orderId: string, transactionStatus: string) {
  const normalizedStatus = transactionStatus.toLowerCase();

  const isSuccess =
    normalizedStatus === "00" ||
    normalizedStatus === "settlement" ||
    normalizedStatus === "capture" ||
    normalizedStatus === "paid" ||
    normalizedStatus === "success";

  const isFailure =
    normalizedStatus === "01" ||
    normalizedStatus === "expire" ||
    normalizedStatus === "expired" ||
    normalizedStatus === "cancel" ||
    normalizedStatus === "cancelled" ||
    normalizedStatus === "deny";

  return await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.findUnique({
      where: { bookingCode: orderId },
      include: { tickets: true },
    });

    if (!booking) {
      throw new Error(`Booking ${orderId} not found`);
    }

    if (booking.paymentStatus === "PAID") {
      return { booking, alreadyPaid: true };
    }

    if (isSuccess) {
      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "PAID",
          paidAt: new Date(),
        },
        include: {
          tickets: true,
          showtime: {
            include: { film: true },
          },
        },
      });
      return { booking: updated, status: "PAID" };
    }

    if (isFailure) {
      await tx.ticket.deleteMany({
        where: { bookingId: booking.id },
      });

      const updated = await tx.booking.update({
        where: { id: booking.id },
        data: {
          paymentStatus: "EXPIRED",
        },
      });
      return { booking: updated, status: "EXPIRED" };
    }

    return { booking, status: booking.paymentStatus };
  });
}
