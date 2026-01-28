"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = { isLoggedIn: boolean; user?: { id: string; email: string; name?: string } | null; logout: () => void };
type ThemeContextType = { theme: 'dark' | 'light'; toggle: () => void };

const ThemeContext = createContext<ThemeContextType | null>(null);
const AuthContext = createContext<AuthContextType | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within ThemeProvider');
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name?: string } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') setTheme(saved);
      else {
        const prefers = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        setTheme(prefers ? 'light' : 'dark');
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') root.setAttribute('data-theme', 'light');
    else root.removeAttribute('data-theme');
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem('pb_user');
    if (stored) {
      setUser(JSON.parse(stored));
      setIsLoggedIn(true);
    }
  }, []);

  function toggle() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  function logout() {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('pb_user');
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, logout }}>
      <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
