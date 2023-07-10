/*
  Warnings:

  - You are about to drop the column `questionId` on the `Submit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submit" DROP CONSTRAINT "Submit_questionId_fkey";

-- AlterTable
ALTER TABLE "Submit" DROP COLUMN "questionId";
