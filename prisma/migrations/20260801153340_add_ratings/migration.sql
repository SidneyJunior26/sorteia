-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "averageRating" DOUBLE PRECISION,
ADD COLUMN     "ratingsCount" INTEGER NOT NULL DEFAULT 0;
