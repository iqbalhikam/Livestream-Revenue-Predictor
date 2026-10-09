'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck, ArrowLeft, AlertCircle, Info, Lock } from 'lucide-react';
import { useLanguage } from '@/components/LanguageContext';
import { ThemeToggle } from '@/components/ThemeToggle';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/prediksi';
  const { language } = useLanguage();

  const isIndo = language === 'id';

  const loginUrl = `/api/auth/login?callbackUrl=${encodeURIComponent(callbackUrl)}`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-500/10 dark:bg-indigo-600/15 rounded-full blur-3xl -z-10" />

      {/* Top Bar Nav */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>{isIndo ? 'Kembali ke Beranda' : 'Back to Home'}</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/5">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mb-5">
            <Lock className="w-7 h-7" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/50 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isIndo ? 'Akses Terbatas' : 'Private Access'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            StreamLytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
            {isIndo
              ? 'Sistem ini dikhususkan untuk pemilik. Masuk dengan akun Google Anda yang terdaftar.'
              : 'This system is restricted to the owner. Sign in with your registered Google account.'}
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-400 text-xs sm:text-sm flex gap-3 items-start animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
            <div>
              <p className="font-semibold">
                {error === 'missing_credentials'
                  ? isIndo
                    ? 'Kredensial Belum Dikonfigurasi'
                    : 'Missing Google Credentials'
                  : isIndo
                  ? 'Gagal Masuk'
                  : 'Authentication Error'}
              </p>
              <p className="mt-1 leading-relaxed">
                {error === 'missing_credentials'
                  ? isIndo
                    ? 'GOOGLE_CLIENT_ID dan GOOGLE_CLIENT_SECRET belum diisi pada file .env sistem.'
                    : 'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are not yet set in the .env file.'
                  : error === 'state_mismatch'
                  ? isIndo
                    ? 'Sesi login kadaluarsa. Silakan coba klik tombol login lagi.'
                    : 'Login session expired. Please click sign in again.'
                  : isIndo
                  ? `Pesan: ${error}. Pastikan akun Anda telah didaftarkan di Google Cloud Console Test Users.`
                  : `Message: ${error}. Ensure your account is added to Google Cloud Console Test Users.`}
              </p>
            </div>
          </div>
        )}

        {/* Sign In Button */}
        <a
          href={loginUrl}
          className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-100 font-semibold rounded-2xl border border-slate-300 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.99] text-base group">
          <GoogleIcon />
          <span>{isIndo ? 'Lanjutkan dengan Google' : 'Sign in with Google'}</span>
        </a>

        {/* Informational Notice */}
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/80 text-center">
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>
              {isIndo
                ? 'Proteksi Google OAuth 2.0 (Testing Mode)'
                : 'Secured via Google OAuth 2.0 (Testing Mode)'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 leading-normal">
            {isIndo
              ? 'Akun selain yang didaftarkan pada Google Cloud Test Users akan ditolak secara otomatis oleh Google.'
              : 'Accounts other than those listed in Google Cloud Test Users will be rejected automatically.'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      }>
      <LoginContent />
    </Suspense>
  );
}
