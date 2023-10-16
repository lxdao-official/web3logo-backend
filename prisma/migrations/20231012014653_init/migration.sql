/*
  Warnings:

  - You are about to drop the column `url` on the `Logos` table. All the data in the column will be lost.
  - Added the required column `authorAddress` to the `Logos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file` to the `Logos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoName` to the `Logos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `logoType` to the `Logos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_logoId_fkey";

-- AlterTable
ALTER TABLE "Logos" DROP COLUMN "url",
ADD COLUMN     "authorAddress" TEXT NOT NULL,
ADD COLUMN     "file" TEXT NOT NULL,
ADD COLUMN     "logoName" TEXT NOT NULL,
ADD COLUMN     "logoType" TEXT NOT NULL,
ADD COLUMN     "website" TEXT;
