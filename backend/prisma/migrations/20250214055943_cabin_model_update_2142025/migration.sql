-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cabin" (
    "cabin_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service_id" INTEGER NOT NULL,
    "min_capacity" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "additional_fee_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cabin_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("service_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cabin_additional_fee_id_fkey" FOREIGN KEY ("additional_fee_id") REFERENCES "additional_fees" ("additional_fee_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_cabin" ("additional_fee_id", "cabin_id", "created_at", "max_capacity", "min_capacity", "service_id", "updated_at") SELECT "additional_fee_id", "cabin_id", "created_at", "max_capacity", "min_capacity", "service_id", "updated_at" FROM "cabin";
DROP TABLE "cabin";
ALTER TABLE "new_cabin" RENAME TO "cabin";
CREATE UNIQUE INDEX "cabin_service_id_key" ON "cabin"("service_id");
CREATE UNIQUE INDEX "cabin_additional_fee_id_key" ON "cabin"("additional_fee_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
