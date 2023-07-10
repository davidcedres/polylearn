/*
  Warnings:

  - The primary key for the `Submit` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Submit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Submit" DROP CONSTRAINT "Submit_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "Submit_pkey" PRIMARY KEY ("user", "answerId");
