-- CreateTable
CREATE TABLE "Users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TidyUrl" (
    "id" TEXT NOT NULL,
    "origin_url" TEXT NOT NULL,
    "tidy_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "userId" TEXT,

    CONSTRAINT "TidyUrl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrlAccess" (
    "id" TEXT NOT NULL,
    "accesses" INTEGER NOT NULL,
    "last_access" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tidyUrlId" TEXT NOT NULL,

    CONSTRAINT "UrlAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TidyUrl" ADD CONSTRAINT "TidyUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UrlAccess" ADD CONSTRAINT "UrlAccess_tidyUrlId_fkey" FOREIGN KEY ("tidyUrlId") REFERENCES "TidyUrl"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
