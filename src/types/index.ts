import { z } from 'zod';

// Supported languages for syntax highlighting
export const SUPPORTED_LANGUAGES = [
  'plaintext',
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'html',
  'css',
  'json',
  'xml',
  'sql',
  'bash',
  'java',
  'cpp',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'kotlin',
  'swift',
  'markdown',
] as const;

export type Language = (typeof SUPPORTED_LANGUAGES)[number];

// Expiration time options
export const EXPIRATION_OPTIONS = {
  '10m': { label: '10 minutes', ms: 10 * 60 * 1000 },
  '1h': { label: '1 hour', ms: 60 * 60 * 1000 },
  '1d': { label: '1 day', ms: 24 * 60 * 60 * 1000 },
  '1w': { label: '1 week', ms: 7 * 24 * 60 * 60 * 1000 },
  never: { label: 'Never', ms: null },
} as const;

export type ExpirationTime = keyof typeof EXPIRATION_OPTIONS;

// View expiration options
export const VIEW_EXPIRATION_OPTIONS = [1, 10, 100] as const;
export type ViewExpiration = (typeof VIEW_EXPIRATION_OPTIONS)[number] | null;

// Validation Schemas
export const CreatePasteSchema = z.object({
  content: z
    .string()
    .min(1, 'Content cannot be empty')
    .max(1000000, 'Content is too large (max 1MB)'),
  language: z.enum(SUPPORTED_LANGUAGES).default('plaintext'),
  expireTime: z.enum(['10m', '1h', '1d', '1w', 'never']).optional(),
  maxViews: z.union([z.literal(1), z.literal(10), z.literal(100), z.null()]).optional(),
});

export type CreatePasteInput = z.infer<typeof CreatePasteSchema>;

export const CreatePasteResponse = z.object({
  id: z.string(),
  url: z.string(),
});

export type CreatePasteResponseType = z.infer<typeof CreatePasteResponse>;

// Database model type
export interface Paste {
  id: string;
  content: string;
  language: Language;
  expiresAt: Date | null;
  maxViews: number | null;
  currentViews: number;
  createdAt: Date;
  isExpired: boolean;
}

export interface PasteViewResponse {
  content: string;
  language: Language;
  currentViews: number;
  maxViews: number | null;
  expiresAt: string | null;
  createdAt: string;
}

export interface PasteErrorResponse {
  error: string;
}

// API Error types
export type ApiResponse<T> = { success: true; data: T } | { success: false; error: string };

// Paste expiration reasons
export enum ExpirationReason {
  TIME_EXPIRED = 'Paste has expired (time limit)',
  VIEWS_EXCEEDED = 'Paste has expired (view limit reached)',
  NOT_FOUND = 'Paste not found',
}
