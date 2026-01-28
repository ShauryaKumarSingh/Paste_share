'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/ThemeProvider';
import { Card } from '@/components/ui/Card';

interface UserPaste {
  id: string;
  language: string;
  currentViews: number;
  maxViews: number | null;
  createdAt: string;
  expiresAt: string | null;
  isExpired: boolean;
}

export default function DashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const [pastes, setPastes] = useState<UserPaste[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      window.location.href = '/login';
      return;
    }

    fetchUserPastes();
  }, [isLoggedIn, user]);

  async function fetchUserPastes() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user/pastes?userId=${user?.id}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to fetch pastes');

      setPastes(data.pastes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pastes');
    } finally {
      setIsLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-bold gradient-text">Please sign in</h2>
          <Link href="/login" className="btn-primary px-6 py-2 inline-block">
            Sign in
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{
      background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
    }}>
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(at 20% 50%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.1) 0px, transparent 50%)
        `
      }} />

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="relative z-10 container-custom min-h-screen py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold gradient-text">My Pastes</h1>
            <p className="text-gray-400">View and manage your saved pastes</p>
          </div>

          {/* Loading State */}
          {isLoading && (
            <Card className="text-center py-12">
              <div className="inline-block">
                <div className="w-8 h-8 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-gray-400">Loading your pastes...</p>
            </Card>
          )}

          {/* Error State */}
          {error && (
            <Card className="p-4 bg-rose-500/10 border border-rose-500/50">
              <p className="text-rose-300">{error}</p>
            </Card>
          )}

          {/* Empty State */}
          {!isLoading && !error && pastes.length === 0 && (
            <Card className="text-center py-12 space-y-4">
              <p className="text-gray-400 text-lg">No pastes yet</p>
              <p className="text-gray-500">Create your first paste to get started</p>
              <Link href="/" className="btn-primary px-6 py-2 inline-block">
                Create a Paste
              </Link>
            </Card>
          )}

          {/* Pastes Grid */}
          {!isLoading && !error && pastes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastes.map((paste, idx) => {
                const createdDate = new Date(paste.createdAt);
                const expiresDate = paste.expiresAt ? new Date(paste.expiresAt) : null;
                const isExpired = paste.isExpired || (expiresDate && expiresDate < new Date());

                return (
                  <motion.div
                    key={paste.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                  >
                    <Link href={`/paste/${paste.id}`}>
                      <Card className="group cursor-pointer hover:border-purple-500/50 transition-all h-full">
                        <div className="space-y-3">
                          {/* Language Badge */}
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 text-xs font-semibold rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {paste.language}
                            </span>
                            {isExpired && (
                              <span className="text-xs text-rose-300 font-semibold">Expired</span>
                            )}
                          </div>

                          {/* Created Date */}
                          <div className="text-sm text-gray-400">
                            Created {createdDate.toLocaleDateString()} at {createdDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-700">
                            <span>👁️ {paste.currentViews} views</span>
                            {paste.maxViews && (
                              <span>/ {paste.maxViews} max</span>
                            )}
                          </div>

                          {/* Expiration Info */}
                          {expiresDate && (
                            <div className="text-xs text-gray-500">
                              {isExpired ? (
                                <span className="text-rose-400">Expired {expiresDate.toLocaleDateString()}</span>
                              ) : (
                                <span>Expires {expiresDate.toLocaleDateString()}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
