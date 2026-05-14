"use client";

const TOKEN_KEY = "token";
const USER_KEY = "user";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (matches backend JWT expiry)

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function setCurrentUser(user: object): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getCurrentUser<
  T = { _id: string; name: string; email: string; role: string },
>(): T | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
