import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { Role } from '@prisma/client';

// In-memory store for rate limiting
const requestCounts = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per window

const protectedRoutes: { [key in Role]?: string[] } = {
    ADMIN: ['/dashboard/admin'],
    CREATOR: ['/dashboard/creator'],
    ORGANIZER: ['/dashboard/organizer'],
    FAN: ['/dashboard/fan'],
};



export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? '127.0.0.1';

  // Rate Limiting
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (record && now - record.timestamp < RATE_LIMIT_WINDOW) {
    if (record.count > RATE_LIMIT_MAX_REQUESTS) {
      return new NextResponse('Too many requests', { status: 429 });
    }
    requestCounts.set(ip, { ...record, count: record.count + 1 });
  } else {
    requestCounts.set(ip, { count: 1, timestamp: now });
  }

  const session = await getSession();

  const rolePaths: Record<string, string> = {
      [Role.ADMIN]: '/dashboard/admin',
      [Role.CREATOR]: '/dashboard/creator',
      [Role.ORGANIZER]: '/dashboard/organizer',
      [Role.FAN]: '/dashboard/fan',
  };

  // Redirect authenticated users from auth pages like login/register only
  if (['/', '/login', '/register'].includes(path) && session) {
      const redirectUrl = rolePaths[session.role] || '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
  }

  // RBAC for protected routes
  if (session) {
      const userRole = session.role as Role;
      const allowedRoutes = protectedRoutes[userRole];
      const isAuthorized = allowedRoutes?.some(route => path.startsWith(route));

      if (path.startsWith('/dashboard') && !isAuthorized) {
          // Redirect to their own dashboard if they try to access a generic /dashboard or another role's dashboard
          const redirectUrl = rolePaths[userRole] || '/';
          return NextResponse.redirect(new URL(redirectUrl, req.nextUrl));
      }
  } else {
      // Protect all dashboard routes if no session
      if (path.startsWith('/dashboard')) {
          return NextResponse.redirect(new URL('/login', req.nextUrl));
      }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\.png$).*)'],
};