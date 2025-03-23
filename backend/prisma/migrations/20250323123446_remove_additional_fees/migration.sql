/*
  Warnings:

  - You are about to drop the `additional_fees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `additional_fee_id` on the `cabins` table. All the data in the column will be lost.
  - You are about to drop the column `additionalFeeId` on the `day_tour_activities` table. All the data in the column will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "additional_fees";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cabins" (
    "cabin_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service_id" INTEGER NOT NULL,
    "min_capacity" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cabins_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("service_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cabins" ("cabin_id", "created_at", "max_capacity", "min_capacity", "service_id", "updated_at") SELECT "cabin_id", "created_at", "max_capacity", "min_capacity", "service_id", "updated_at" FROM "cabins";
DROP TABLE "cabins";
ALTER TABLE "new_cabins" RENAME TO "cabins";
CREATE TABLE "new_day_tour_activities" (
    "day_tour_activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "serviceId" INTEGER NOT NULL,
    CONSTRAINT "day_tour_activities_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("service_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_day_tour_activities" ("created_at", "day_tour_activity_id", "serviceId", "updated_at") SELECT "created_at", "day_tour_activity_id", "serviceId", "updated_at" FROM "day_tour_activities";
DROP TABLE "day_tour_activities";
ALTER TABLE "new_day_tour_activities" RENAME TO "day_tour_activities";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
