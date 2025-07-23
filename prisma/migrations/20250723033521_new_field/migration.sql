-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'credentials';

-- CreateTable
CREATE TABLE "OtpToken" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otpCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "purpose" TEXT NOT NULL,

    CONSTRAINT "OtpToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OtpToken_userId_purpose_key" ON "OtpToken"("userId", "purpose");

-- AddForeignKey
ALTER TABLE "OtpToken" ADD CONSTRAINT "OtpToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
