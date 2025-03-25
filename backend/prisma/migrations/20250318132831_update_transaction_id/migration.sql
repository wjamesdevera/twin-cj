/*
  Warnings:

  - The primary key for the `transactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `transaction_id` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
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
    CONSTRAINT "bookings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("customer_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_booking_status_id_fkey" FOREIGN KEY ("booking_status_id") REFERENCES "booking_statuses" ("booking_status_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "bookings_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions" ("transaction_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_bookings" ("booking_id", "booking_status_id", "check_in", "check_out", "created_at", "customer_id", "notes", "reference_code", "total_pax", "transaction_id", "updated_at") SELECT "booking_id", "booking_status_id", "check_in", "check_out", "created_at", "customer_id", "notes", "reference_code", "total_pax", "transaction_id", "updated_at" FROM "bookings";
DROP TABLE "bookings";
ALTER TABLE "new_bookings" RENAME TO "bookings";
CREATE UNIQUE INDEX "bookings_reference_code_key" ON "bookings"("reference_code");
CREATE UNIQUE INDEX "bookings_transaction_id_key" ON "bookings"("transaction_id");
CREATE TABLE "new_transactions" (
    "transaction_id" TEXT NOT NULL PRIMARY KEY,
    "proof_of_payment_image_url" TEXT,
    "amount" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "payment_account_id" INTEGER,
    "payment_status_id" INTEGER,
    CONSTRAINT "transactions_payment_account_id_fkey" FOREIGN KEY ("payment_account_id") REFERENCES "payment_accounts" ("payment_account_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "transactions_payment_status_id_fkey" FOREIGN KEY ("payment_status_id") REFERENCES "payment_statuses" ("payment_status_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_transactions" ("amount", "created_at", "payment_account_id", "payment_status_id", "proof_of_payment_image_url", "transaction_id", "updated_at") SELECT "amount", "created_at", "payment_account_id", "payment_status_id", "proof_of_payment_image_url", "transaction_id", "updated_at" FROM "transactions";
DROP TABLE "transactions";
ALTER TABLE "new_transactions" RENAME TO "transactions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
