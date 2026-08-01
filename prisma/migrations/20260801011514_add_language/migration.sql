-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "language" TEXT;

-- CreateIndex
CREATE INDEX "Book_language_idx" ON "Book"("language");
