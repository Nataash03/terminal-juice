import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (path.startsWith('/dashboard/se') && userRole !== 'seller') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (path === '/dashboard' && userRole === 'seller') {
    return NextResponse.redirect(new URL('/dashboard/se', request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: '/dashboard/:path*' };