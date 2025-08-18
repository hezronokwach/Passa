"use server"

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

interface SessionPayload {
  userId: number;
  role: string;
  expires: Date;
  [key: string]: unknown; // Index signature to make it compatible with JWTPayload
}

const secretKey = process.env.SESSION_SECRET;
if (!secretKey) {
  throw new Error('SESSION_SECRET environment variable is not set');
}
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h from now')
    .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    
    // Validate that the payload has the required fields
    if (typeof payload.userId === 'number' && 
        typeof payload.role === 'string' && 
        payload.expires) {
      return payload as SessionPayload;
    }
    
    return null;
  } catch(e) {
    console.error("JWT Verification failed", e);
    return null;
  }
}

export async function createSession(userId: number, role: string) {
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  const session = await encrypt({ userId, role, expires });

  (await cookies()).set('session', session, { expires, httpOnly: true, secure: process.env.NODE_ENV === 'production', path: '/' });
}

export async function getSession() {
  const sessionCookie = (await cookies()).get('session')?.value;
  if (!sessionCookie) return null;
  const session = await decrypt(sessionCookie);
  return session;
}

export async function deleteSession() {
  (await cookies()).delete('session');
}
