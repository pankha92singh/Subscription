import crypto from 'crypto';
import { cookies } from 'next/headers';

const COOKIE_NAME = 'nesubs_session';
const ADMIN_COOKIE = 'nesubs_admin_session';
const secret = process.env.SESSION_SECRET || 'dev-secret-change-me';

type Payload = { userId?: number; admin?: boolean; exp: number };

function sign(value: string) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function encode(payload: Payload) {
  const raw = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${raw}.${sign(raw)}`;
}

function decode(token: string | undefined): Payload | null {
  if (!token) return null;
  const [raw, sig] = token.split('.');
  if (!raw || !sig || sign(raw) !== sig) return null;
  const payload = JSON.parse(Buffer.from(raw, 'base64url').toString()) as Payload;
  if (Date.now() > payload.exp) return null;
  return payload;
}

export async function createUserSession(userId: number) {
  cookies().set(COOKIE_NAME, encode({ userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 7 }), { httpOnly: true, sameSite: 'lax', path: '/' });
}

export async function getUserId() {
  return decode(cookies().get(COOKIE_NAME)?.value)?.userId ?? null;
}

export async function destroyUserSession() {
  cookies().delete(COOKIE_NAME);
}

export async function createAdminSession() {
  cookies().set(ADMIN_COOKIE, encode({ admin: true, exp: Date.now() + 1000 * 60 * 60 * 12 }), { httpOnly: true, sameSite: 'lax', path: '/' });
}

export async function isAdminSession() {
  return !!decode(cookies().get(ADMIN_COOKIE)?.value)?.admin;
}

export async function destroyAdminSession() {
  cookies().delete(ADMIN_COOKIE);
}
