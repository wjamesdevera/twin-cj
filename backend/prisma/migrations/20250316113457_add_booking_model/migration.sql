-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference_code" TEXT NOT NULL,
    "check_in" DATETIME NOT NULL,
    "check_out" DATETIME NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "booking_status_id" INTEGER NOT NULL,
    CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_booking_status_id_fkey" FOREIGN KEY ("booking_status_id") REFERENCES "booking_statuses" ("booking_status_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_customer_id_key" ON "bookings"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_booking_status_id_key" ON "bookings"("booking_status_id");
