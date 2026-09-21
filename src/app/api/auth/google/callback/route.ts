import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { createSessionToken, setAuthCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const errorParam = url.searchParams.get("error");

  const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || url.host;
  const proto = request.headers.get("x-forwarded-proto") || (url.protocol.replace(":", "") || "http");
  const appUrl = `${proto}://${host}`;

  if (errorParam) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Login Google dibatalkan.")}`, appUrl));
  }

  const cookieStore = await cookies();
  const savedState = cookieStore.get("google_oauth_state")?.value;
  cookieStore.delete("google_oauth_state");

  if (!code || !state || !savedState || state !== savedState) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Sesi otentikasi Google telah kedaluwarsa.")}`, appUrl));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${appUrl}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Kredensial Google OAuth server belum lengkap.")}`, appUrl));
  }

  try {
    // 1. Tukar authorization code dengan access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("Gagal mendapatkan token Google:", tokenData);
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Gagal menukar token dengan Google.")}`, appUrl));
    }

    // 2. Ambil data profil user dari Google UserInfo API
    const userinfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const profile = await userinfoRes.json();

    if (!userinfoRes.ok || !profile.email) {
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Gagal mengambil data profil Google.")}`, appUrl));
    }

    const email = profile.email.toLowerCase().trim();
    const name = profile.name || "Penonton";
    const googleId = profile.id;
    const avatarUrl = profile.picture || null;

    // 3. Cek apakah user sudah ada di database
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          authProvider: "GOOGLE",
          avatarUrl,
        },
      });
    } else {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId,
            authProvider: user.authProvider === "LOCAL" ? "GOOGLE" : user.authProvider,
            avatarUrl: user.avatarUrl || avatarUrl,
          },
        });
      }
    }

    // Hubungkan booking sebelumnya yang dilakukan tanpa login dengan email sama
    await prisma.booking.updateMany({
      where: {
        customerEmail: email,
        userId: null,
      },
      data: {
        userId: user.id,
      },
    });

    // 4. Buat session token & pasang auth cookie
    const token = createSessionToken(user);
    await setAuthCookie(token);

    return NextResponse.redirect(new URL("/dashboard", appUrl));
  } catch (err: unknown) {
    console.error("Error pada callback Google OAuth:", err);
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent("Terjadi kesalahan sistem pada login Google.")}`, appUrl));
  }
}
