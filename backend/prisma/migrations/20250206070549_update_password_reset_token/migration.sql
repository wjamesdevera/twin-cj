/*
  Warnings:

  - Made the column `user_account_id` on table `password_reset_tokens` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_password_reset_tokens" (
    "password_reset_token_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "password_reset_tokens_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_password_reset_tokens" ("created_at", "expires_at", "password_reset_token_id", "updated_at", "user_account_id") SELECT "created_at", "expires_at", "password_reset_token_id", "updated_at", "user_account_id" FROM "password_reset_tokens";
DROP TABLE "password_reset_tokens";
ALTER TABLE "new_password_reset_tokens" RENAME TO "password_reset_tokens";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
