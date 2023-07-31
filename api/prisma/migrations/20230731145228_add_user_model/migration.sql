/*
  Warnings:

  - The primary key for the `Submit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user` on the `Submit` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Submit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submit" DROP CONSTRAINT "Submit_pkey",
DROP COLUMN "user",
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Submit_pkey" PRIMARY KEY ("userId", "answerId");

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "signature" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- AddForeignKey
ALTER TABLE "Submit" ADD CONSTRAINT "Submit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
