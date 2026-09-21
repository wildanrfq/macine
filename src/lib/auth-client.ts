"use client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
} | null;

let memoryUser: AuthUser | undefined = undefined;
const listeners = new Set<(user: AuthUser) => void>();

export function getCachedUser(): AuthUser | undefined {
  return memoryUser;
}

export function setCachedUser(user: AuthUser) {
  memoryUser = user;
  listeners.forEach((listener) => {
    try {
      listener(user);
    } catch {
      // Ignore listener error
    }
  });

  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent<AuthUser>("macine:auth-change", { detail: user })
    );
  }
}

export function subscribeAuth(listener: (user: AuthUser) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  try {
    const res = await fetch("/api/auth/me", { cache: "no-store" });
    if (!res.ok) {
      setCachedUser(null);
      return null;
    }
    const data = await res.json();
    const user: AuthUser = data.user ?? null;
    setCachedUser(user);
    return user;
  } catch {
    setCachedUser(null);
    return null;
  }
}

export async function logoutClient(): Promise<void> {
  setCachedUser(null);
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Cache-Control": "no-cache" },
    });
  } catch {
    // Ignore network error on logout
  }
}
