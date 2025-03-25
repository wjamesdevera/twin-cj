/*
  Warnings:

  - You are about to drop the column `user_account_id` on the `sessions` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_SessionToUserAccount" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SessionToUserAccount_A_fkey" FOREIGN KEY ("A") REFERENCES "sessions" ("session_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SessionToUserAccount_B_fkey" FOREIGN KEY ("B") REFERENCES "user_accounts" ("user_account_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sessions" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "user_agent" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_sessions" ("created_at", "session_id", "updated_at", "user_agent") SELECT "created_at", "session_id", "updated_at", "user_agent" FROM "sessions";
DROP TABLE "sessions";
ALTER TABLE "new_sessions" RENAME TO "sessions";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "_SessionToUserAccount_AB_unique" ON "_SessionToUserAccount"("A", "B");

-- CreateIndex
CREATE INDEX "_SessionToUserAccount_B_index" ON "_SessionToUserAccount"("B");
