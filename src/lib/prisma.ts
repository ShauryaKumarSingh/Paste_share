import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const clientConfig = process.env.DATABASE_URL ? { datasources: { db: { url: process.env.DATABASE_URL } } } : undefined;

export const prisma = globalForPrisma.prisma || new PrismaClient(clientConfig as any);

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
