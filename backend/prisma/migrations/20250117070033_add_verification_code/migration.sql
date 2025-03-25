/*
  Warnings:

  - Added the required column `expires_at` to the `password_reset_tokens` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "verification_codes" (
    "verification_code_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT NOT NULL,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "verification_codes_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_password_reset_tokens" (
    "password_reset_token_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "password_reset_tokens_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_password_reset_tokens" ("created_at", "password_reset_token_id", "updated_at", "user_account_id") SELECT "created_at", "password_reset_token_id", "updated_at", "user_account_id" FROM "password_reset_tokens";
DROP TABLE "password_reset_tokens";
ALTER TABLE "new_password_reset_tokens" RENAME TO "password_reset_tokens";
CREATE UNIQUE INDEX "password_reset_tokens_user_account_id_key" ON "password_reset_tokens"("user_account_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_user_account_id_key" ON "verification_codes"("user_account_id");
