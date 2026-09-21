"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import UserNavMenu from "./UserNavMenu";
import ThemeToggle from "./ThemeToggle";
import {
  AuthUser,
  getCachedUser,
  setCachedUser,
  subscribeAuth,
  fetchCurrentUser,
} from "@/lib/auth-client";

interface NavbarProps {
  initialUser?: AuthUser;
}

export default function Navbar({ initialUser }: NavbarProps) {
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1D99DE] transition-transform group-hover:scale-110" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#F49924] transition-transform group-hover:scale-110" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D21871] transition-transform group-hover:scale-110" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-ink transition-colors group-hover:text-[#D21871]">
              BIOSKOP MINI
            </span>
            <span className="text-xs uppercase tracking-widest text-reel">
              Cikini
            </span>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium">
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
      </div>
    </header>
  );
}
