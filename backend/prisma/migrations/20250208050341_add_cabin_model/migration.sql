-- CreateTable
CREATE TABLE "cabin" (
    "cabin_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "min_capacity" INTEGER NOT NULL,
    "max_capacity" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "service_id" INTEGER NOT NULL,
    "additional_fee_id" INTEGER NOT NULL,
    CONSTRAINT "cabin_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services" ("service_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "cabin_additional_fee_id_fkey" FOREIGN KEY ("additional_fee_id") REFERENCES "additional_fees" ("additional_fee_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "cabin_service_id_key" ON "cabin"("service_id");

-- CreateIndex
CREATE UNIQUE INDEX "cabin_additional_fee_id_key" ON "cabin"("additional_fee_id");
