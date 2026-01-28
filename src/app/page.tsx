'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { TextArea } from '@/components/ui/TextArea';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import { ToastContainer, ToastMessage } from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/components/ThemeProvider';
import { SUPPORTED_LANGUAGES, EXPIRATION_OPTIONS, VIEW_EXPIRATION_OPTIONS, CreatePasteSchema, Language } from '@/types';
import Link from 'next/link';

const languageOptions = SUPPORTED_LANGUAGES.map(lang => ({ value: lang, label: lang }));
const expirationOptions = Object.entries(EXPIRATION_OPTIONS).map(([value, { label }]) => ({
  value,
  label,
}));
const viewOptions = [
  { value: 'unlimited', label: 'Unlimited views' },
  { value: '1', label: 'Burn after reading (1 view)' },
  { value: '10', label: '10 views' },
  { value: '100', label: '100 views' },
];

export default function Home() {
  const router = useRouter();
  const { isLoggedIn, user } = useAuth();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState<Language>('plaintext');
  const [expireTime, setExpireTime] = useState('never');
  const [maxViews, setMaxViews] = useState('unlimited');
  const [isLoading, setIsLoading] = useState(false);
  const [contentError, setContentError] = useState('');

  const toast = useToast((newToast) => setToasts(prev => [...prev, newToast]));

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-lg"
        >
          <h2 className="text-4xl font-bold gradient-text">Sign in to create pastes</h2>
          <p className="text-[var(--muted)]">Please log in or create an account to start sharing code and text.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/login" className="btn-primary px-6 py-2">Sign in</Link>
            <Link href="/signup" className="btn-secondary px-6 py-2">Create account</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const handleCreatePaste = async () => {
    setContentError('');

    try {
      // Validate
      const validationResult = CreatePasteSchema.safeParse({
        content,
        language,
        expireTime,
        maxViews: maxViews === 'unlimited' ? null : parseInt(maxViews),
      });

      if (!validationResult.success) {
        const issues = validationResult.error.issues;
        if (issues.length > 0) {
          const issue = issues[0];
          if (issue.path[0] === 'content') {
            setContentError(issue.message);
          } else {
            toast.error('Validation Error', issue.message);
          }
        }
        return;
      }

      setIsLoading(true);

      const response = await fetch('/api/paste', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          language,
          expireTime: expireTime === 'never' ? 'never' : expireTime,
          maxViews: maxViews === 'unlimited' ? null : parseInt(maxViews),
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create paste');
      }

      const data = await response.json();

      toast.success('Paste Created!', 'Your paste is ready to share');

      // Redirect to paste view
      router.push(`/paste/${data.id}`);
    } catch (error) {
      toast.error(
        'Error',
        error instanceof Error ? error.message : 'Failed to create paste',
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      
      {/* Animated gradient orbs */}
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

      <div className="relative z-10 container-custom min-h-screen py-8 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold gradient-text">
              Paste Share
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Share code snippets, notes, and text instantly with powerful expiration controls and syntax highlighting
            </p>
          </div>

          {/* Main Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Textarea Section */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="space-y-4">
                  <TextArea
                    value={content}
                    onChange={(e) => {
                      setContent(e.target.value);
                      setContentError('');
                    }}
                    placeholder="Paste your content here..."
                    rows={12}
                    error={contentError}
                  />
                  <div className="text-sm text-gray-500">
                    {content.length} characters
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Options Section */}
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-4 gradient-text">
                      Options
                    </h2>
                  </div>

                  <Select
                    label="Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    options={languageOptions}
                  />

                  <Select
                    label="Expiration"
                    value={expireTime}
                    onChange={(e) => setExpireTime(e.target.value)}
                    options={expirationOptions}
                  />

                  <Select
                    label="Max Views"
                    value={maxViews}
                    onChange={(e) => setMaxViews(e.target.value)}
                    options={viewOptions}
                  />

                  <Button
                    onClick={handleCreatePaste}
                    isLoading={isLoading}
                    size="lg"
                    className="w-full"
                  >
                    Create Paste
                  </Button>
                </Card>
              </motion.div>

              {/* Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card className="text-sm space-y-3">
                  <div className="flex gap-2">
                    <span className="text-accent-300 font-bold">✓</span>
                    <p className="text-gray-300">Auto-expiration</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent-300 font-bold">✓</span>
                    <p className="text-gray-300">Syntax highlighting</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent-300 font-bold">✓</span>
                    <p className="text-gray-300">View tracking</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-accent-300 font-bold">✓</span>
                    <p className="text-gray-300">One-click copy</p>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <ToastContainer
        toasts={toasts}
        onRemove={(id) => setToasts(prev => prev.filter(t => t.id !== id))}
      />
    </div>
  );
}
