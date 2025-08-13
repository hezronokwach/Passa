import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/login', '/register', '/'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((prefix) => path.startsWith(prefix));
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  if ((path.startsWith('/login') || path.startsWith('/register')) && session) {
    switch (session.role) {
      case 'ADMIN':
        return NextResponse.redirect(new URL('/dashboard/admin', req.nextUrl));
      case 'CREATOR':
        return NextResponse.redirect(new URL('/dashboard/creator', req.nextUrl));
      case 'ORGANIZER':
        return NextResponse.redirect(new URL('/dashboard/organizer', req.nextUrl));
      case 'FAN':
        return NextResponse.redirect(new URL('/dashboard/fan', req.nextUrl));
      default:
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'],
};
