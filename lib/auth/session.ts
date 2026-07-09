import { createHmac, timingSafeEqual } from "crypto";

const SESSION_VALUE = "authenticated";

function getSecret(): string {
  return process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret).update(value).digest("hex");
}

export function createSessionToken(): string {
  const secret = getSecret();
  return `${SESSION_VALUE}.${sign(SESSION_VALUE, secret)}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [value, signature] = token.split(".");
  if (value !== SESSION_VALUE || !signature) return false;

  const secret = getSecret();
  const expected = sign(SESSION_VALUE, secret);
  const actual = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (actual.length !== expectedBuf.length) return false;
  return timingSafeEqual(actual, expectedBuf);
}
