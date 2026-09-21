import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword, createSessionToken, setAuthCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nama, email, dan kata sandi wajib diisi." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Kata sandi minimal 6 karakter." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      if (existingUser.authProvider === "GOOGLE" || !existingUser.passwordHash) {
        return NextResponse.json(
          {
            error:
              "Email ini sudah terdaftar menggunakan akun Google. Anda tidak dapat mendaftar manual dengan email ini, silakan masuk menggunakan tombol 'Masuk dengan Google'.",
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: "Email sudah terdaftar. Silakan masuk ke akun Anda." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: phone ? phone.trim() : null,
        passwordHash,
        authProvider: "LOCAL",
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    // Hubungkan booking lama jika pemesan pernah memesan sebagai tamu dengan email yang sama
    await prisma.booking.updateMany({
      where: {
        customerEmail: normalizedEmail,
        userId: null,
      },
      data: {
        userId: user.id,
      },
    });

    const token = createSessionToken(user);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan saat pendaftaran.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
