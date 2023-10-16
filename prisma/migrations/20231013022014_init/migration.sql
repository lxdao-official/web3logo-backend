/*
  Warnings:

  - A unique constraint covering the columns `[logoId,address]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Favorites_logoId_address_key" ON "Favorites"("logoId", "address");
