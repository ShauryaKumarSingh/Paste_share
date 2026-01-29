-- CreateTable
CREATE TABLE "Paste" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'plaintext',
    "expiresAt" TIMESTAMP(3),
    "maxViews" INTEGER,
    "currentViews" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isExpired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Paste_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Paste_id_idx" ON "Paste"("id");

-- CreateIndex
CREATE INDEX "Paste_createdAt_idx" ON "Paste"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");
