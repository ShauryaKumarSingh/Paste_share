import { EXPIRATION_OPTIONS, ExpirationTime } from '@/types';

/**
 * Calculate expiration date based on time option
 */
export function calculateExpirationDate(expireTime?: ExpirationTime): Date | null {
  if (!expireTime || expireTime === 'never') {
    return null;
  }

  const optionMs = EXPIRATION_OPTIONS[expireTime].ms;
  if (optionMs === null) {
    return null;
  }

  return new Date(Date.now() + optionMs);
}

/**
 * Check if a paste has expired based on time
 */
export function isTimeExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) {
    return false;
  }

  return new Date() > expiresAt;
}

/**
 * Check if a paste has exceeded view limit
 */
export function isViewsExpired(currentViews: number, maxViews: number | null): boolean {
  if (maxViews === null) {
    return false;
  }

  return currentViews >= maxViews;
}

/**
 * Check if a paste is expired (either by time or views)
 */
export function isPasteExpired(
  expiresAt: Date | null,
  currentViews: number,
  maxViews: number | null,
): boolean {
  return isTimeExpired(expiresAt) || isViewsExpired(currentViews, maxViews);
}

/**
 * Generate a shareable URL for a paste
 */
export function generateShareUrl(id: string, baseUrl: string): string {
  const url = new URL(`/paste/${id}`, baseUrl);
  return url.toString();
}

/**
 * Format time remaining for expiration
 */
export function getTimeRemaining(expiresAt: Date | null): string | null {
  if (!expiresAt) {
    return null;
  }

  const now = new Date();
  const diffMs = expiresAt.getTime() - now.getTime();

  if (diffMs <= 0) {
    return 'Expired';
  }

  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d remaining`;
  }

  if (diffHours > 0) {
    return `${diffHours}h remaining`;
  }

  if (diffMinutes > 0) {
    return `${diffMinutes}m remaining`;
  }

  return `${diffSeconds}s remaining`;
}

/**
 * Get progress percentage for view limit
 */
export function getViewProgress(currentViews: number, maxViews: number | null): number {
  if (!maxViews) {
    return 0;
  }

  return Math.min((currentViews / maxViews) * 100, 100);
}

/**
 * Get progress percentage for time expiration
 */
export function getTimeProgress(createdAt: Date, expiresAt: Date | null): number {
  if (!expiresAt) {
    return 0;
  }

  const now = new Date();
  const total = expiresAt.getTime() - createdAt.getTime();
  const elapsed = now.getTime() - createdAt.getTime();

  return Math.min((elapsed / total) * 100, 100);
}
