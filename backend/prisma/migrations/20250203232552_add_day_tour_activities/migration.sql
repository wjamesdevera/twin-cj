-- CreateTable
CREATE TABLE "day_tour_activities" (
    "day_tour_activity_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "serviceId" INTEGER NOT NULL,
    "additionalFeeId" INTEGER NOT NULL,
    CONSTRAINT "day_tour_activities_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services" ("service_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_tour_activities_additionalFeeId_fkey" FOREIGN KEY ("additionalFeeId") REFERENCES "additional_fees" ("additional_fee_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "day_tour_activities_serviceId_key" ON "day_tour_activities"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "day_tour_activities_additionalFeeId_key" ON "day_tour_activities"("additionalFeeId");
