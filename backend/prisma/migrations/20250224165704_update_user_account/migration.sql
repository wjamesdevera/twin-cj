-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_user_accounts" (
    "user_account_id" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "personal_id" TEXT NOT NULL,
    "user_account_status_id" INTEGER,
    "authRoleId" INTEGER,
    CONSTRAINT "user_accounts_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "personal_details" ("personal_detail_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_accounts_user_account_status_id_fkey" FOREIGN KEY ("user_account_status_id") REFERENCES "user_account_statuses" ("user_account_status_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "user_accounts_authRoleId_fkey" FOREIGN KEY ("authRoleId") REFERENCES "auth_roles" ("auth_role_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_user_accounts" ("authRoleId", "created_at", "password", "personal_id", "updated_at", "user_account_id", "user_account_status_id") SELECT "authRoleId", "created_at", "password", "personal_id", "updated_at", "user_account_id", "user_account_status_id" FROM "user_accounts";
DROP TABLE "user_accounts";
ALTER TABLE "new_user_accounts" RENAME TO "user_accounts";
CREATE UNIQUE INDEX "user_accounts_personal_id_key" ON "user_accounts"("personal_id");
CREATE UNIQUE INDEX "user_accounts_user_account_status_id_key" ON "user_accounts"("user_account_status_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
