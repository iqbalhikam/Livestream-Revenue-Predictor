import { NextResponse } from 'next/server';
import { signToken, SessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error)}`, req.url));
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/login?error=invalid_request', req.url));
  }

  // Retrieve stored oauth_state cookie
  const cookieHeader = req.headers.get('cookie') || '';
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map((c) => {
      const [k, ...v] = c.split('=');
      return [k, decodeURIComponent(v.join('='))];
    })
  );

  const rawState = cookies['oauth_state'];
  let savedState: { state: string; callbackUrl?: string } | null = null;
  try {
    if (rawState) savedState = JSON.parse(rawState);
  } catch {
    savedState = null;
  }

  if (!savedState || savedState.state !== state) {
    return NextResponse.redirect(new URL('/login?error=state_mismatch', req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL('/login?error=missing_credentials', req.url));
  }

  const host = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000';
  const proto = req.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${proto}://${host}/api/auth/callback`;

  try {
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errText = await tokenResponse.text();
      console.error('Failed to exchange Google token:', errText);
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', req.url));
    }

    const tokenData = await tokenResponse.json();

    // Fetch user profile from Google
    const userinfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userinfoResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=userinfo_failed', req.url));
    }

    const profile = await userinfoResponse.json();

    // Create session (valid for 7 days)
    const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
    const sessionUser: SessionUser = {
      id: profile.sub,
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      exp,
    };

    const token = await signToken(sessionUser);

    const destination = savedState.callbackUrl || '/prediksi';
    const redirectUrl = new URL(destination.startsWith('/') ? destination : '/prediksi', req.url);
    const response = NextResponse.redirect(redirectUrl);

    // Set signed auth_session cookie
    response.cookies.set('auth_session', token, {
      httpOnly: true,
      secure: proto === 'https',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    // Clear state cookie
    response.cookies.delete('oauth_state');

    return response;
  } catch (err) {
    console.error('OAuth Callback Error:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', req.url));
  }
}
