import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.delete('auth_session');
  response.cookies.delete('oauth_state');
  return response;
}

export async function POST(req: Request) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete('auth_session');
  response.cookies.delete('oauth_state');
  return response;
}
