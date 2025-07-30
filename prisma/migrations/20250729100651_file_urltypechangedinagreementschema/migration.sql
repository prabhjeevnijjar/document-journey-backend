/*
  Warnings:

  - Made the column `file` on table `Agreement` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Agreement" ALTER COLUMN "file" SET NOT NULL,
ALTER COLUMN "file" SET DATA TYPE TEXT;
