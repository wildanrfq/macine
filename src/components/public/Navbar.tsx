"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import UserNavMenu from "./UserNavMenu";
import ThemeToggle from "./ThemeToggle";
import {
  AuthUser,
  getCachedUser,
  setCachedUser,
  subscribeAuth,
  fetchCurrentUser,
  logoutClient,
} from "@/lib/auth-client";

interface NavbarProps {
  initialUser?: AuthUser;
}

export default function Navbar({ initialUser }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const router = useRouter();

  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  const user = useSyncExternalStore(
    subscribeAuth,
    () => {
      const cached = getCachedUser();
      if (cached !== undefined) return cached;
      return initialUser ?? null;
    },
    () => initialUser ?? null
  );

  useEffect(() => {
    if (initialUser !== undefined) {
      if (getCachedUser() !== initialUser) {
        setCachedUser(initialUser);
      }
    } else if (getCachedUser() === undefined) {
      fetchCurrentUser();
    }
  }, [initialUser]);

  const handleMobileLogout = async () => {
    setMobileMenuOpen(false);
    await logoutClient();
    router.refresh();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-paper/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 sm:py-4">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#1D99DE] transition-transform group-hover:scale-110" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#F49924] transition-transform group-hover:scale-110" />
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#D21871] transition-transform group-hover:scale-110" />
          </div>
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-[#D21871]">
              BIOSKOP MINI
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-reel">
              Cikini
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex items-center gap-4 text-sm font-medium">
          <Link
            href="/films"
            className="text-ink transition-colors hover:text-[#1D99DE]"
          >
            Program Film
          </Link>
          <Link
            href="/about"
            className="text-ink transition-colors hover:text-[#1D99DE]"
          >
            Tentang
          </Link>

          <ThemeToggle />

          {user ? (
            <UserNavMenu user={user} />
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-ink transition-colors hover:text-[#1D99DE]"
              >
                Masuk
              </Link>
              <Link
                href="/dashboard"
                className="rounded border border-[#D21871] bg-white px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[#D21871] shadow-sm transition-all hover:bg-[#D21871] hover:text-white"
              >
                Tiket Saya
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Actions: ThemeToggle + Hamburger Toggle */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded border border-line bg-white text-ink transition-colors hover:border-[#1D99DE]"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-line bg-paper px-5 py-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 font-medium">
            <Link
              href="/films"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-line/60 pb-2.5 text-sm text-ink hover:text-[#1D99DE]"
            >
              <span>Program Film & Jadwal</span>
              <span className="font-mono text-xs text-reel">Kurasi Sinema</span>
            </Link>

            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-line/60 pb-2.5 text-sm text-ink hover:text-[#1D99DE]"
            >
              <span>Tentang Bioskop</span>
              <span className="font-mono text-xs text-reel">Cikini 42</span>
            </Link>

            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between border-b border-line/60 pb-2.5 text-sm text-ink hover:text-[#D21871]"
            >
              <span>Tiket Saya</span>
              <span className="font-mono text-xs text-[#D21871]">Lihat Tiket</span>
            </Link>

            {user ? (
              <div className="pt-2">
                <div className="rounded border border-line bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D99DE] font-mono text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-ink">{user.name}</p>
                      <p className="truncate font-mono text-[10px] text-reel">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleMobileLogout}
                    className="mt-3 w-full border-t border-line pt-2 text-left font-mono text-xs text-reel hover:text-[#D21871]"
                  >
                    Keluar Sesi (Logout)
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center border border-line bg-white py-2.5 text-center text-xs font-semibold text-ink shadow-sm hover:border-[#1D99DE]"
                >
                  Masuk Akun
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center bg-[#D21871] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-white shadow-sm hover:bg-[#B4115F]"
                >
                  Daftar
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
