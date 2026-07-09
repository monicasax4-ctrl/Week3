import { cookies } from "next/headers";
import { createSessionToken } from "@/lib/auth/session";
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE_SECONDS,
} from "@/lib/auth/cookie";

export async function POST(request: Request) {
  const { password } = await request.json();
  const expected = process.env.APP_PASSWORD || "OPS123";

  if (password !== expected) {
    return Response.json({ error: "Incorrect password" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return Response.json({ ok: true });
}
