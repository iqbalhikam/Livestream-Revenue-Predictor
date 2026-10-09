'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { LogOut, User as UserIcon, Lock } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export function UserNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isIndo = language === 'id';

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2.5 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-xs">
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.name || 'User'}
            className="w-6 h-6 rounded-full object-cover border border-indigo-400"
          />
        ) : (
          <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
          </div>
        )}
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[100px] truncate hidden sm:inline">
          {user.name?.split(' ')[0] || user.email}
        </span>
        <a
          href="/api/auth/logout"
          title={isIndo ? 'Keluar' : 'Logout'}
          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-0.5">
          <LogOut className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-full shadow-md shadow-indigo-500/20 transition-all hover:scale-105">
      <Lock className="w-3.5 h-3.5" />
      <span>{isIndo ? 'Masuk' : 'Sign In'}</span>
    </Link>
  );
}
