import { promises as fs } from 'fs';
import path from 'path';

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

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  const users: UserRecord[] = JSON.parse(raw || '[]');
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createUser(record: Omit<UserRecord, 'createdAt'>): Promise<UserRecord> {
  await ensureFile();
  const raw = await fs.readFile(USERS_FILE, 'utf8');
  const users: UserRecord[] = JSON.parse(raw || '[]');
  const newRec: UserRecord = { ...record, createdAt: new Date().toISOString() };
  users.push(newRec);
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
  return newRec;
}
