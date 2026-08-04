-- CreateTable
CREATE TABLE "RateLimitEntry" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "RateLimitEntry_pkey" PRIMARY KEY ("key","windowStart")
);
