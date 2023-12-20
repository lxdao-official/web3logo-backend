-- DropIndex
DROP INDEX "Logos_file_key";

-- AlterTable
ALTER TABLE "LogoNames" ALTER COLUMN "logoType" DROP NOT NULL;
