import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { prisma } from '@/lib/prisma';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PASTES_FILE = path.join(DATA_DIR, 'pastes.json');

// FIX 1: Allow userId to be null (matches database)
type Paste = {
  id: string;
  content: string;
  language: string;
  userId: string | null;
  expiresAt?: string | null;
  maxViews?: number | null;
  currentViews: number;
  createdAt: string;
  isExpired: boolean;
};

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(PASTES_FILE);
  } catch (e) {
    await fs.writeFile(PASTES_FILE, JSON.stringify([]), 'utf8');
  }
}

const useDatabase = Boolean(process.env.DATABASE_URL);

export async function createPaste(data: { content: string; language: string; userId: string; expiresAt?: string | null; maxViews?: number | null; }) {
  if (useDatabase) {
    const id = randomUUID();
    const created = await prisma.paste.create({
      data: {
        id,
        content: data.content,
        language: data.language || 'plaintext',
        userId: data.userId,
        expiresAt: data.expiresAt ?? null,
        maxViews: data.maxViews ?? null,
        currentViews: 0,
        isExpired: false,
      },
    });

    return {
      id: created.id,
      content: created.content,
      language: created.language,
      userId: created.userId,
      // FIX 2: Convert Date to String
      expiresAt: created.expiresAt ? created.expiresAt.toISOString() : null,
      maxViews: created.maxViews ?? null,
      currentViews: created.currentViews,
      createdAt: created.createdAt.toISOString(),
      isExpired: created.isExpired,
    } as Paste;
  }

  await ensureFile();
  const raw = await fs.readFile(PASTES_FILE, 'utf8');
  const items: Paste[] = JSON.parse(raw || '[]');
  const id = randomUUID();
  const record: Paste = {
    id,
    content: data.content,
    language: data.language || 'plaintext',
    userId: data.userId,
    expiresAt: data.expiresAt ?? null,
    maxViews: data.maxViews ?? null,
    currentViews: 0,
    createdAt: new Date().toISOString(),
    isExpired: false,
  };
  items.push(record);
  await fs.writeFile(PASTES_FILE, JSON.stringify(items, null, 2), 'utf8');
  return record;
}

export async function getPasteById(id: string) {
  if (useDatabase) {
    const p = await prisma.paste.findUnique({ where: { id } });
    if (!p) return null;
    return {
      id: p.id,
      content: p.content,
      language: p.language,
      userId: p.userId,
      // FIX 3: Convert Date to String
      expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
      maxViews: p.maxViews ?? null,
      currentViews: p.currentViews,
      createdAt: p.createdAt.toISOString(),
      isExpired: p.isExpired,
    } as Paste;
  }

  await ensureFile();
  const raw = await fs.readFile(PASTES_FILE, 'utf8');
  const items: Paste[] = JSON.parse(raw || '[]');
  return items.find((p) => p.id === id) ?? null;
}

export async function incrementViews(id: string) {
  if (useDatabase) {
    const p = await prisma.paste.findUnique({ where: { id } });
    if (!p) return null;
    
    // FIX 4: If expired, return the FORMATTED object, not the raw DB object
    if (p.isExpired) {
        return {
            id: p.id,
            content: p.content,
            language: p.language,
            userId: p.userId,
            expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
            maxViews: p.maxViews ?? null,
            currentViews: p.currentViews,
            createdAt: p.createdAt.toISOString(),
            isExpired: p.isExpired,
        } as Paste;
    }

    const newViews = (p.currentViews || 0) + 1;
    const isExpired = p.maxViews !== null && p.maxViews !== undefined && newViews >= (p.maxViews as number);

    const updated = await prisma.paste.update({ where: { id }, data: { currentViews: newViews, isExpired } });
    
    return {
      id: updated.id,
      content: updated.content,
      language: updated.language,
      userId: updated.userId,
      // FIX 5: Convert Date to String here too
      expiresAt: updated.expiresAt ? updated.expiresAt.toISOString() : null,
      maxViews: updated.maxViews ?? null,
      currentViews: updated.currentViews,
      createdAt: updated.createdAt.toISOString(),
      isExpired: updated.isExpired,
    } as Paste;
  }

  await ensureFile();
  const raw = await fs.readFile(PASTES_FILE, 'utf8');
  const items: Paste[] = JSON.parse(raw || '[]');
  const idx = items.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  const p = items[idx];
  if (p.isExpired) return p;
  p.currentViews = (p.currentViews || 0) + 1;
  // mark expired if exceeded
  if (p.maxViews !== null && p.maxViews !== undefined && p.currentViews >= p.maxViews) {
    p.isExpired = true;
  }
  items[idx] = p;
  await fs.writeFile(PASTES_FILE, JSON.stringify(items, null, 2), 'utf8');
  return p;
}

export async function getPastesByUserId(userId: string) {
  if (useDatabase) {
    const rows = await prisma.paste.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
    return rows.map((p) => ({
      id: p.id,
      language: p.language,
      currentViews: p.currentViews,
      maxViews: p.maxViews ?? null,
      createdAt: p.createdAt.toISOString(),
      // FIX 6: Convert Date to String
      expiresAt: p.expiresAt ? p.expiresAt.toISOString() : null,
      isExpired: p.isExpired,
    }));
  }

  await ensureFile();
  const raw = await fs.readFile(PASTES_FILE, 'utf8');
  const items: Paste[] = JSON.parse(raw || '[]');
  return items
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}