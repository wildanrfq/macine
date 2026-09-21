"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserNavMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function UserNavMenu({ user }: UserNavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setIsOpen(false);
    router.push("/");
    router.refresh();
  };

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-line bg-white py-1 pr-3 pl-1 shadow-sm transition-all hover:border-[#1D99DE]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1D99DE] font-mono text-xs font-bold text-white">
          {initial}
        </span>
        <span className="max-w-[120px] truncate text-xs font-semibold text-ink">
          {user.name.split(" ")[0]}
        </span>
        <span className="text-[10px] text-reel">▼</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 border border-line bg-white p-2 shadow-warm-lg z-50">
          <div className="border-b border-line px-3 py-2">
            <p className="truncate text-xs font-bold text-ink">{user.name}</p>
            <p className="truncate font-mono text-[10px] text-reel">{user.email}</p>
          </div>

          <div className="py-1">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-medium text-ink hover:bg-[#FAF8F5] hover:text-[#D21871]"
            >
              <span>Tiket & Riwayat Saya</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D21871]" />
            </Link>
          </div>

          <div className="border-t border-line pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full px-3 py-2 text-left font-mono text-xs text-reel hover:bg-[#FAF8F5] hover:text-[#D21871]"
            >
              Keluar (Logout)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
