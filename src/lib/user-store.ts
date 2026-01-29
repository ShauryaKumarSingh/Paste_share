import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

type UserRecord = { id: string; email: string; password: string; name?: string; createdAt: string };

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(USERS_FILE);
  } catch (e) {
    await fs.writeFile(USERS_FILE, JSON.stringify([]), 'utf8');
  }
}

const useDatabase = Boolean(process.env.DATABASE_URL);

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  if (useDatabase) {
    const u = await prisma.user.findUnique({ where: { email } });
    if (!u) return null;
    return { id: u.id, email: u.email, password: u.password, name: u.name ?? undefined, createdAt: u.createdAt.toISOString() };
  }

  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  const users: UserRecord[] = JSON.parse(raw || '[]');
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(record: Omit<UserRecord, 'createdAt'>): Promise<UserRecord> {
  if (useDatabase) {
    const created = await prisma.user.create({ data: { id: record.id, email: record.email, password: record.password, name: record.name } });
    return { id: created.id, email: created.email, password: created.password, name: created.name ?? undefined, createdAt: created.createdAt.toISOString() };
  }

  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  const users: UserRecord[] = JSON.parse(raw || '[]');
  const newRec: UserRecord = { ...record, createdAt: new Date().toISOString() };
  users.push(newRec);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  return newRec;
}
