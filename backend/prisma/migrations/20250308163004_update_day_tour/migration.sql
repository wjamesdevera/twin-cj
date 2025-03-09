-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_day_tour_activities" (
    "day_tour_activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "additionalFeeId" INTEGER,
    CONSTRAINT "day_tour_activities_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("service_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_tour_activities_additionalFeeId_fkey" FOREIGN KEY ("additionalFeeId") REFERENCES "additional_fees" ("additional_fee_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_day_tour_activities" ("additionalFeeId", "created_at", "day_tour_activity_id", "serviceId", "updated_at") SELECT "additionalFeeId", "created_at", "day_tour_activity_id", "serviceId", "updated_at" FROM "day_tour_activities";
DROP TABLE "day_tour_activities";
ALTER TABLE "new_day_tour_activities" RENAME TO "day_tour_activities";
CREATE UNIQUE INDEX "day_tour_activities_serviceId_key" ON "day_tour_activities"("serviceId");
CREATE UNIQUE INDEX "day_tour_activities_additionalFeeId_key" ON "day_tour_activities"("additionalFeeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
