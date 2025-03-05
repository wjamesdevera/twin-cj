/*
  Warnings:

  - You are about to drop the `cabin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "cabin";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "cabins" (
    "cabin_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "service_id" INTEGER NOT NULL,
    "min_capacity" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "additional_fee_id" INTEGER,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cabins_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("service_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "cabins_additional_fee_id_fkey" FOREIGN KEY ("additional_fee_id") REFERENCES "additional_fees" ("additional_fee_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "cabins_service_id_key" ON "cabins"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "cabins_additional_fee_id_key" ON "cabins"("additional_fee_id");
