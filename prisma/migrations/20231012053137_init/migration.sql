/*
  Warnings:

  - You are about to drop the column `logoName` on the `Logos` table. All the data in the column will be lost.
  - You are about to drop the column `logoType` on the `Logos` table. All the data in the column will be lost.
  - You are about to drop the column `website` on the `Logos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Logos" DROP COLUMN "logoName",
DROP COLUMN "logoType",
DROP COLUMN "website",
ADD COLUMN     "logoNameId" INTEGER;

-- CreateTable
CREATE TABLE "LogoNames" (
    "id" SERIAL NOT NULL,
    "logoName" TEXT NOT NULL,
    "logoType" TEXT NOT NULL,
    "website" TEXT,

    CONSTRAINT "LogoNames_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogoNames_logoName_key" ON "LogoNames"("logoName");

-- AddForeignKey
ALTER TABLE "Logos" ADD CONSTRAINT "Logos_logoNameId_fkey" FOREIGN KEY ("logoNameId") REFERENCES "LogoNames"("id") ON DELETE SET NULL ON UPDATE CASCADE;
