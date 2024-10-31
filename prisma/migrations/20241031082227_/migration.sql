-- CreateEnum
CREATE TYPE "VmsEventStatus" AS ENUM ('CANCELLED', 'PENDING', 'COMPLETED', 'DISAPPROVED', 'APPROVED', 'ONGOING');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('INACTIVE', 'CHECKED_IN', 'CHECKED_OUT', 'ACTIVE');

-- CreateEnum
CREATE TYPE "CodeStatus" AS ENUM ('DEFAULT', 'EXPIRED', 'CANCELLED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Guest" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL,
    "codeStatus" "CodeStatus" NOT NULL DEFAULT 'DEFAULT',
    "inviteStatus" "InviteStatus" NOT NULL,
    "usage" INTEGER NOT NULL DEFAULT 0,
    "purposeOfVisit" TEXT,
    "adminId" TEXT,
    "oneTime" BOOLEAN NOT NULL,
    "isEvent" BOOLEAN,
    "eventId" INTEGER,
    "entryTime" TIMESTAMP(3),
    "exitTime" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usageLocation" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "usageType" TEXT NOT NULL DEFAULT '',
    "guestId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VmsEvent" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "expectedGuest" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "eventStatus" "VmsEventStatus" NOT NULL DEFAULT 'PENDING',
    "startFrom" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER,
    "visitorId" INTEGER,
    "acceptedGuestEntry" TEXT,
    "acceptedGuestExit" TEXT,
    "guestId" INTEGER,

    CONSTRAINT "VmsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Visitor_userId_key" ON "Visitor"("userId");

-- CreateIndex
CREATE INDEX "guest_idx" ON "Visitor"("guestId");

-- CreateIndex
CREATE INDEX "user_idx" ON "Visitor"("userId");

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VmsEvent" ADD CONSTRAINT "VmsEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VmsEvent" ADD CONSTRAINT "VmsEvent_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VmsEvent" ADD CONSTRAINT "VmsEvent_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
