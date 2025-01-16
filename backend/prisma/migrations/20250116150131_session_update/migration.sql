/*
  Warnings:

  - Made the column `user_account_id` on table `sessions` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sessions" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT NOT NULL,
    "user_agent" TEXT,
    "expires_at" DATETIME NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sessions" ("created_at", "expires_at", "session_id", "updated_at", "user_account_id", "user_agent") SELECT "created_at", "expires_at", "session_id", "updated_at", "user_account_id", "user_agent" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
