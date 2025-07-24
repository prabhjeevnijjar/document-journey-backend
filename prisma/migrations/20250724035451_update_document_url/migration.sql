/*
  Warnings:

  - You are about to drop the column `file` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "file",
ADD COLUMN     "fileUrl" TEXT;
