/*
  Warnings:

  - You are about to drop the column `accesses` on the `UrlAccess` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UrlAccess" DROP COLUMN "accesses",
ADD COLUMN     "userid" TEXT;

-- AddForeignKey
ALTER TABLE "UrlAccess" ADD CONSTRAINT "UrlAccess_userid_fkey" FOREIGN KEY ("userid") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
