/*
  Warnings:

  - Added the required column `personal_id` to the `user_accounts` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_accounts" (
    "user_account_id" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "personal_id" TEXT NOT NULL,
    CONSTRAINT "user_accounts_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "personal_details" ("personal_detail_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_user_accounts" ("created_at", "password", "updatedAt", "user_account_id") SELECT "created_at", "password", "updatedAt", "user_account_id" FROM "user_accounts";
DROP TABLE "user_accounts";
ALTER TABLE "new_user_accounts" RENAME TO "user_accounts";
CREATE UNIQUE INDEX "user_accounts_personal_id_key" ON "user_accounts"("personal_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
