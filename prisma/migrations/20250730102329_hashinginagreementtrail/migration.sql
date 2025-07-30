/*
  Warnings:

  - Changed the type of `status` on the `Agreement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AgreementStatus" AS ENUM ('CREATED', 'SENT', 'COMPLETED', 'EXPIRED', 'CANCELLED');

-- AlterTable
ALTER TABLE "Agreement" DROP COLUMN "status",
ADD COLUMN     "status" "AgreementStatus" NOT NULL;

-- AlterTable
ALTER TABLE "AgreementTrail" ADD COLUMN     "logHash" TEXT,
ADD COLUMN     "previousLogHash" TEXT;
