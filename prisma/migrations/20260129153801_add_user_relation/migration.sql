-- AlterTable
ALTER TABLE "Paste" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Paste" ADD CONSTRAINT "Paste_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
