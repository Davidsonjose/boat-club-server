/*
  Warnings:

  - A unique constraint covering the columns `[memberId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Settings" ADD COLUMN     "inviteLimit" TEXT NOT NULL DEFAULT '30',
ADD COLUMN     "notificationSeen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "todayInvite" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "unSeenNorification" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deactivated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "memberId" TEXT;

-- AlterTable
ALTER TABLE "Visitor" ALTER COLUMN "expiresAt" DROP NOT NULL,
ALTER COLUMN "validFrom" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_memberId_key" ON "User"("memberId");
