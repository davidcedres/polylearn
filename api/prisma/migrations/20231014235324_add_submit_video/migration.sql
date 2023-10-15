/*
  Warnings:

  - Added the required column `clip` to the `Submit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Submit" ADD COLUMN     "clip" TEXT NOT NULL;
