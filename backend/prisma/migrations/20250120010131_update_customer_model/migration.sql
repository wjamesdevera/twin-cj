/*
  Warnings:

  - Made the column `personal_detail_id` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_customers" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personal_detail_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "customers_personal_detail_id_fkey" FOREIGN KEY ("personal_detail_id") REFERENCES "personal_details" ("personal_detail_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_customers" ("created_at", "customer_id", "personal_detail_id", "updated_at") SELECT "created_at", "customer_id", "personal_detail_id", "updated_at" FROM "customers";
DROP TABLE "customers";
ALTER TABLE "new_customers" RENAME TO "customers";
CREATE UNIQUE INDEX "customers_personal_detail_id_key" ON "customers"("personal_detail_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
