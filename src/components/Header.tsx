"use client";
import Link from 'next/link';
import { useTheme, useAuth } from './ThemeProvider';

export default function Header() {
  const { theme, toggle } = useTheme();
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <header className="w-full py-3 px-6 flex items-center justify-between border-b border-[var(--glass-border)]">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg hover:opacity-80 transition group">
          <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg group-hover:shadow-xl transition">PS</div>
          <span className="gradient-text">Paste Share</span>
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {isLoggedIn && (
          <>
            <span className="text-xs text-[var(--muted)] px-2">{user?.email}</span>
            <Link href="/dashboard" className="btn-ghost text-xs px-3 py-1.5">My Pastes</Link>
            <button
              onClick={logout}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Sign out
            </button>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link href="/login" className="btn-ghost text-xs px-3 py-1.5">Log in</Link>
            <Link href="/signup" className="btn-primary text-xs px-3 py-1.5">Sign up</Link>
          </>
        )}
        <button
          aria-label="Toggle theme"
          onClick={toggle}
          className="btn-ghost text-xs px-3 py-1.5 ml-2 border border-[var(--glass-border)]"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>
    </header>
  );
}
