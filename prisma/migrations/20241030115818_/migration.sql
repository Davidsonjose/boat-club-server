/*
  Warnings:

  - You are about to drop the column `tourId` on the `ClubLocation` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Tour` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Tour` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tourLocationId]` on the table `Tour` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tourLocationId` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClubLocation" DROP CONSTRAINT "ClubLocation_tourId_fkey";

-- AlterTable
ALTER TABLE "ClubLocation" DROP COLUMN "tourId";

-- AlterTable
ALTER TABLE "Tour" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "tourLocationId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "_OtherTourLocations" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OtherTourLocations_AB_unique" ON "_OtherTourLocations"("A", "B");

-- CreateIndex
CREATE INDEX "_OtherTourLocations_B_index" ON "_OtherTourLocations"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Tour_tourLocationId_key" ON "Tour"("tourLocationId");

-- AddForeignKey
ALTER TABLE "Tour" ADD CONSTRAINT "Tour_tourLocationId_fkey" FOREIGN KEY ("tourLocationId") REFERENCES "ClubLocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherTourLocations" ADD CONSTRAINT "_OtherTourLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "ClubLocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OtherTourLocations" ADD CONSTRAINT "_OtherTourLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Tour"("id") ON DELETE CASCADE ON UPDATE CASCADE;
