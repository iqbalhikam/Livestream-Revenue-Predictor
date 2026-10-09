import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check if current route requires authentication
  const isProtectedPage = pathname.startsWith('/prediksi');
  const isProtectedApi = pathname.startsWith('/api/predict');

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_session')?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    if (isProtectedApi) {
      return NextResponse.json(
        { error: 'Unauthorized: Akses ditolak. Harap login dengan akun Google yang berwenang.' },
        { status: 401 }
      );
    }

    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/prediksi/:path*', '/api/predict/:path*'],
};
