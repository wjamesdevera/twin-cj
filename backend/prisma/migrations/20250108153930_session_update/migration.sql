/*
  Warnings:

  - You are about to drop the `_SessionToUserAccount` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_SessionToUserAccount_B_index";

-- DropIndex
DROP INDEX "_SessionToUserAccount_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_SessionToUserAccount";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sessions" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_sessions" ("created_at", "session_id", "updated_at", "user_agent") SELECT "created_at", "session_id", "updated_at", "user_agent" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
