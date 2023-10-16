/*
  Warnings:

  - You are about to drop the column `authorId` on the `Logos` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Logos" DROP CONSTRAINT "Logos_authorId_fkey";

-- AlterTable
ALTER TABLE "Logos" DROP COLUMN "authorId";

-- DropTable
DROP TABLE "Users";

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Logos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
