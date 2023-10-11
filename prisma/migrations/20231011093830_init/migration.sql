/*
  Warnings:

  - Added the required column `status` to the `Logos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Logos" ADD COLUMN     "status" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Favourites" (
    "id" SERIAL NOT NULL,
    "logoId" INTEGER,
    "authorId" INTEGER,

    CONSTRAINT "Favourites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Logos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourites" ADD CONSTRAINT "Favourites_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
