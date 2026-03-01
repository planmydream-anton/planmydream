import { SignJWT, jwtVerify } from 'jose'
import type { H3Event } from 'h3'

interface JWTPayload {
  userId: string
  email: string
  role: string
}

const COOKIE_NAME = 'admin-token'
const TOKEN_EXPIRY = '7d'

function getSecret() {
  const config = useRuntimeConfig()
  return new TextEncoder().encode(config.jwtSecret)
}

export async function createToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(TOKEN_EXPIRY)
    .setIssuedAt()
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(token, getSecret())
  return payload as unknown as JWTPayload
}

export function setAuthCookie(event: H3Event, token: string) {
  setCookie(event, COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
}

export function clearAuthCookie(event: H3Event) {
  deleteCookie(event, COOKIE_NAME, {
    path: '/',
  })
}

export async function requireAuth(event: H3Event): Promise<JWTPayload> {
  const token = getCookie(event, COOKIE_NAME)

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Необходима авторизация',
    })
  }

  try {
    const payload = await verifyToken(token)
    return payload
  } catch {
    clearAuthCookie(event)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Токен недействителен или истёк',
    })
  }
}

export async function requireRole(event: H3Event, role: 'admin' | 'manager'): Promise<JWTPayload> {
  const user = await requireAuth(event)

  if (user.role !== role && user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Недостаточно прав',
    })
  }

  return user
}
