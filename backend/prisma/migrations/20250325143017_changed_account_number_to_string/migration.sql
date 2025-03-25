-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_payment_accounts" (
    "payment_account_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "payment_method_id" INTEGER,
    CONSTRAINT "payment_accounts_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_methods" ("payment_method_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_payment_accounts" ("account_name", "account_number", "created_at", "payment_account_id", "payment_method_id", "updated_at") SELECT "account_name", "account_number", "created_at", "payment_account_id", "payment_method_id", "updated_at" FROM "payment_accounts";
DROP TABLE "payment_accounts";
ALTER TABLE "new_payment_accounts" RENAME TO "payment_accounts";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
