import { useCallback } from 'react';
import { ToastMessage } from '@/components/ui/Toast';

export function useToast(
  onAddToast: (toast: ToastMessage) => void,
) {
  const success = useCallback(
    (title: string, description?: string) => {
      onAddToast({
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        type: 'success',
      });
    },
    [onAddToast],
  );

  const error = useCallback(
    (title: string, description?: string) => {
      onAddToast({
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        type: 'error',
      });
    },
    [onAddToast],
  );

  const info = useCallback(
    (title: string, description?: string) => {
      onAddToast({
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        type: 'info',
      });
    },
    [onAddToast],
  );

  const warning = useCallback(
    (title: string, description?: string) => {
      onAddToast({
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        type: 'warning',
      });
    },
    [onAddToast],
  );

  return { success, error, info, warning };
}
