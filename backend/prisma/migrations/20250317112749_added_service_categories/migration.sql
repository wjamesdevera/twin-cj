/*
  Warnings:

  - Added the required column `serviceCategoryId` to the `services` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "day_tour_activities_serviceId_key";

-- CreateTable
CREATE TABLE "service_categories" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "categoryId" INTEGER NOT NULL,
    CONSTRAINT "service_categories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories" ("category_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cabins" (
    "cabin_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service_id" INTEGER NOT NULL,
    "min_capacity" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "additional_fee_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "cabins_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("service_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cabins_additional_fee_id_fkey" FOREIGN KEY ("additional_fee_id") REFERENCES "additional_fees" ("additional_fee_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_cabins" ("additional_fee_id", "cabin_id", "created_at", "max_capacity", "min_capacity", "service_id", "updated_at") SELECT "additional_fee_id", "cabin_id", "created_at", "max_capacity", "min_capacity", "service_id", "updated_at" FROM "cabins";
DROP TABLE "cabins";
ALTER TABLE "new_cabins" RENAME TO "cabins";
CREATE UNIQUE INDEX "cabins_additional_fee_id_key" ON "cabins"("additional_fee_id");
CREATE TABLE "new_services" (
    "service_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "serviceCategoryId" INTEGER NOT NULL,
    CONSTRAINT "services_serviceCategoryId_fkey" FOREIGN KEY ("serviceCategoryId") REFERENCES "service_categories" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_services" ("created_at", "description", "image_url", "name", "price", "service_id", "updated_at") SELECT "created_at", "description", "image_url", "name", "price", "service_id", "updated_at" FROM "services";
DROP TABLE "services";
ALTER TABLE "new_services" RENAME TO "services";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
