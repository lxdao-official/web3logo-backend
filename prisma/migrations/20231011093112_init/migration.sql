-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Logos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "authorId" INTEGER,

    CONSTRAINT "Logos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logos" ADD CONSTRAINT "Logos_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
