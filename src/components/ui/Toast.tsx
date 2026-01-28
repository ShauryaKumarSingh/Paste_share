'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

function ToastItem({ id, title, description, type, duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const bgColor = {
    success: 'bg-emerald-500/20 border-emerald-500/50',
    error: 'bg-rose-500/20 border-rose-500/50',
    info: 'bg-primary-500/20 border-primary-500/50',
    warning: 'bg-amber-500/20 border-amber-500/50',
  }[type];

  const textColor = {
    success: 'text-emerald-300',
    error: 'text-rose-300',
    info: 'text-primary-300',
    warning: 'text-amber-300',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={clsx('glass p-4 border rounded-lg flex gap-3 items-start', bgColor)}
    >
      <span className={clsx('text-xl font-bold', textColor)}>{icon}</span>
      <div className="flex-1">
        <p className={clsx('font-semibold', textColor)}>{title}</p>
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        ×
      </button>
    </motion.div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-tooltip space-y-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem {...toast} onClose={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
