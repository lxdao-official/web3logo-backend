/*
  Warnings:

  - You are about to drop the `Favourites` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Favourites" DROP CONSTRAINT "Favourites_logoId_fkey";

-- DropTable
DROP TABLE "Favourites";

-- CreateTable
CREATE TABLE "Favorites" (
    "id" SERIAL NOT NULL,
    "logoId" INTEGER,
    "address" TEXT NOT NULL,

    CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Favorites" ADD CONSTRAINT "Favorites_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Logos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
