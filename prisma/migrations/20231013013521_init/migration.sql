/*
  Warnings:

  - You are about to drop the column `authorId` on the `Favourites` table. All the data in the column will be lost.
  - Added the required column `address` to the `Favourites` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Favourites" DROP COLUMN "authorId",
ADD COLUMN     "address" TEXT NOT NULL;
