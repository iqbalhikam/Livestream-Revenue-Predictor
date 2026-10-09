import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: Request) {
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [k, ...v] = c.split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const token = cookies['auth_session'];
  if (!token) {
    return NextResponse.json({ user: null });
  }

  const user = await verifyToken(token);
  return NextResponse.json({ user });
}
