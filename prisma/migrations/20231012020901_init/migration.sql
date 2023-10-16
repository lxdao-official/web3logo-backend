/*
  Warnings:

  - A unique constraint covering the columns `[file]` on the table `Logos` will be added. If there are existing duplicate values, this will fail.
  - Made the column `website` on table `Logos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Logos" ALTER COLUMN "website" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Logos_file_key" ON "Logos"("file");
