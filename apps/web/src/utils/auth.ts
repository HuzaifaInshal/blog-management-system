"use client";

const TOKEN_KEY = "token";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days (matches backend JWT expiry)

export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
}

export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
