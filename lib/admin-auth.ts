import { env } from "cloudflare:workers";
import { cookies } from "next/headers";

const encoder = new TextEncoder();

async function hmac(value: string) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(env.ADMIN_SESSION_SECRET || ""), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

export async function createAdminToken() {
  const expires = Date.now() + 1000 * 60 * 60 * 12;
  const payload = `admin.${expires}`;
  return `${payload}.${await hmac(payload)}`;
}

export async function isAdmin() {
  const value = (await cookies()).get("lootnova_admin")?.value || "";
  const parts = value.split(".");
  if (parts.length !== 3 || parts[0] !== "admin" || Number(parts[1]) < Date.now()) return false;
  return safeEqual(parts[2], await hmac(`${parts[0]}.${parts[1]}`));
}

export function validAdminCredentials(phone: string, password: string) {
  return safeEqual(phone, env.ADMIN_PHONE || "") && safeEqual(password, env.ADMIN_PASSWORD || "");
}
