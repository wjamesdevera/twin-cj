/*
  Warnings:

  - You are about to drop the column `message` on the `booking_statuses` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "bookings" ADD COLUMN "message" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_booking_statuses" (
    "booking_status_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_booking_statuses" ("booking_status_id", "created_at", "name", "updated_at") SELECT "booking_status_id", "created_at", "name", "updated_at" FROM "booking_statuses";
DROP TABLE "booking_statuses";
ALTER TABLE "new_booking_statuses" RENAME TO "booking_statuses";
CREATE UNIQUE INDEX "booking_statuses_name_key" ON "booking_statuses"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
