-- CreateTable
CREATE TABLE "customers" (
    "customer_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "personal_detail_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "customers_personal_detail_id_fkey" FOREIGN KEY ("personal_detail_id") REFERENCES "personal_details" ("personal_detail_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_personal_detail_id_key" ON "customers"("personal_detail_id");
