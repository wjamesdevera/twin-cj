-- CreateTable
CREATE TABLE "feedbacks" (
    "feedback_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_bookings" (
    "booking_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "reference_code" TEXT NOT NULL,
    "check_in" DATETIME NOT NULL,
    "check_out" DATETIME NOT NULL,
    "total_pax" INTEGER NOT NULL,
    "notes" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "booking_status_id" INTEGER NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "feedback_id" INTEGER,
    CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_booking_status_id_fkey" FOREIGN KEY ("booking_status_id") REFERENCES "booking_statuses" ("booking_status_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_feedback_id_fkey" FOREIGN KEY ("feedback_id") REFERENCES "feedbacks" ("feedback_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("booking_id", "booking_status_id", "check_in", "check_out", "created_at", "customer_id", "notes", "reference_code", "total_pax", "transaction_id", "updated_at") SELECT "booking_id", "booking_status_id", "check_in", "check_out", "created_at", "customer_id", "notes", "reference_code", "total_pax", "transaction_id", "updated_at" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE UNIQUE INDEX "bookings_reference_code_key" ON "bookings"("reference_code");
CREATE UNIQUE INDEX "bookings_transaction_id_key" ON "bookings"("transaction_id");
CREATE UNIQUE INDEX "bookings_feedback_id_key" ON "bookings"("feedback_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
