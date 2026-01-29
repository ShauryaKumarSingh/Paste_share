'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import { CodeHighlighter } from '@/components/CodeHighlighter';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/hooks/useToast';
import { PasteViewResponse } from '@/types';
import { getTimeRemaining, getViewProgress, getTimeProgress } from '@/lib/utils';

interface PastePageProps {
  params: Promise<{ id: string }>;
}

export default function PastePage({ params }: PastePageProps) {
  const router = useRouter();
  const [pasteId, setPasteId] = useState('');
  const [paste, setPaste] = useState<PasteViewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [showRaw, setShowRaw] = useState(false);

  const toast = useToast((newToast) => setToasts(prev => [...prev, newToast]));

  useEffect(() => {
    params.then(({ id }) => {
      setPasteId(id);
      fetchPaste(id);
    });
  }, [params]);

  const fetchPaste = async (id: string) => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`/api/paste/${id}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to load paste');
      }

      const data: PasteViewResponse = await response.json();
      setPaste(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load paste';
      setError(message);
      toast.error('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!', `${label} copied to clipboard`);
    } catch {
      toast.error('Error', 'Failed to copy to clipboard');
    }
  };

  const shareUrl = paste && `${process.env.NEXT_PUBLIC_APP_URL}/paste/${pasteId}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark py-8">
        <div className="container-custom">
          <SkeletonCard className="mb-8" />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-dark py-8 flex flex-col items-center justify-center">
        <div className="container-custom max-w-2xl">
          <Card className="text-center space-y-6">
            <div className="text-6xl">⚠️</div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Paste Not Found</h1>
              <p className="text-gray-400 mb-6">{error}</p>
            </div>
            <Link href="/">
              <Button>Create a New Paste</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  if (!paste) {
    return null;
  }

  const timeRemaining = paste.expiresAt ? getTimeRemaining(new Date(paste.expiresAt)) : null;
  const viewProgress = getViewProgress(paste.currentViews, paste.maxViews);
  const timeProgress = paste.expiresAt ? getTimeProgress(new Date(paste.createdAt), new Date(paste.expiresAt)) : 0;

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)' }}>
      {/* Background animation */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(at 20% 50%, rgba(99, 102, 241, 0.1) 0px, transparent 50%),
          radial-gradient(at 80% 80%, rgba(139, 92, 246, 0.1) 0px, transparent 50%),
          radial-gradient(at 40% 80%, rgba(6, 182, 212, 0.05) 0px, transparent 50%)
        `
      }} />

      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl"
        animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-br from-accent-300/20 to-transparent rounded-full blur-3xl"
        animate={{ y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity, delay: 1 }}
      />

      <div className="relative z-10">
        {/* Sticky Header */}
        <motion.div
          className="sticky top-0 border-b border-white/10 z-40"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.95))',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div className="container-custom py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition group">
              <span className="text-2xl font-bold gradient-text group-hover:scale-110 transition">←</span>
              <span className="text-sm text-gray-400 hover:text-white transition">Back to Editor</span>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowRaw(!showRaw)}
                className="text-xs"
              >
                {showRaw ? '🎨 Formatted' : '📝 Raw'}
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (!shareUrl) {
                    toast.error('Error', 'Share URL not configured. Set NEXT_PUBLIC_APP_URL');
                    return;
                  }
                  copyToClipboard(shareUrl, 'Link');
                }}
                className="text-xs"
              >
                🔗 Share
              </Button>
              <Button
                size="sm"
                onClick={() => copyToClipboard(paste.content, 'Content')}
                className="text-xs"
              >
                📋 Copy
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="container-custom py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Title Section */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold gradient-text">Code Preview</h1>
              <p className="text-gray-400">Shared on {new Date(paste.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Language */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-500/10 to-transparent hover:from-purple-500/20 transition">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🔤</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Language</span>
                    </div>
                    <p className="text-2xl font-bold capitalize text-purple-300">
                      {paste.language}
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Views */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Card className="border-l-4 border-l-indigo-500 bg-gradient-to-br from-indigo-500/10 to-transparent hover:from-indigo-500/20 transition">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">👁️</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Views</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-indigo-300">
                        {paste.currentViews}
                        {paste.maxViews && <span className="text-gray-500 text-lg"> / {paste.maxViews}</span>}
                      </p>
                    </div>
                    {paste.maxViews && (
                      <div className="space-y-1">
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-indigo-500 to-indigo-300 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${viewProgress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{Math.round(viewProgress)}% capacity</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Expiration */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-cyan-500 bg-gradient-to-br from-cyan-500/10 to-transparent hover:from-cyan-500/20 transition">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⏰</span>
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Expires</span>
                    </div>
                    <p className="text-lg font-bold text-cyan-300">
                      {timeRemaining && timeRemaining !== 'Expired' ? timeRemaining : 'Never'}
                    </p>
                    {paste.expiresAt && timeRemaining !== 'Expired' && (
                      <div className="space-y-1">
                        <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-cyan-500 to-cyan-300 h-2 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(timeProgress, 100)}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                          />
                        </div>
                        <p className="text-xs text-gray-500">{Math.round(timeProgress)}% time elapsed</p>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Code Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-0 overflow-hidden border-2 border-white/10 hover:border-purple-500/30 transition">
                <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/30 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="font-mono text-sm text-gray-400">
                      {paste.language === 'plaintext' ? 'Text' : paste.language.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">{paste.content.length} characters</span>
                </div>
                {showRaw ? (
                  <pre className="p-6 font-mono text-sm overflow-x-auto scrollbar-thin bg-black/20 text-gray-100 whitespace-pre-wrap break-words">
                    <code>{paste.content}</code>
                  </pre>
                ) : (
                  <div className="p-6 bg-black/20">
                    <CodeHighlighter
                      code={paste.content}
                      language={paste.language as any}
                      showLineNumbers={true}
                    />
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center"
            >
              <Button
                onClick={() => {
                  if (!shareUrl) {
                    toast.error('Error', 'Share URL not configured. Set NEXT_PUBLIC_APP_URL');
                    return;
                  }
                  copyToClipboard(shareUrl, 'Link');
                }}
                className="px-6 py-2.5 font-semibold"
              >
                🔗 Copy Share Link
              </Button>
              <Button
                onClick={() => copyToClipboard(paste.content, 'Content')}
                variant="secondary"
                className="px-6 py-2.5 font-semibold"
              >
                📋 Copy Code
              </Button>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="px-6 py-2.5 font-semibold"
                >
                  📊 My Pastes
                </Button>
              </Link>
              <Link href="/">
                <Button
                  variant="ghost"
                  className="px-6 py-2.5 font-semibold"
                >
                  ➕ Create New
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}
