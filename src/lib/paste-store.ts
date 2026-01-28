import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const PASTES_FILE = path.join(DATA_DIR, 'pastes.json');

type Paste = {
  id: string;
  content: string;
  language: string;
  userId: string;
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

export async function createPaste(data: { content: string; language: string; userId: string; expiresAt?: string | null; maxViews?: number | null; }) {
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
  await ensureFile();
  const raw = await fs.readFile(PASTES_FILE, 'utf8');
  const items: Paste[] = JSON.parse(raw || '[]');
  return items.find((p) => p.id === id) ?? null;
}

export async function incrementViews(id: string) {
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
  await ensureFile();
  const raw = await fs.readFile(PASTES_FILE, 'utf8');
  const items: Paste[] = JSON.parse(raw || '[]');
  return items
    .filter((p) => p.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
