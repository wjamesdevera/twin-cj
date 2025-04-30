/*
  Warnings:

  - You are about to drop the `_AuthPermissionToAuthRole` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_permissions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `authRoleId` on the `user_accounts` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_AuthPermissionToAuthRole_B_index";

-- DropIndex
DROP INDEX "_AuthPermissionToAuthRole_AB_unique";

-- DropIndex
DROP INDEX "auth_permissions_name_key";

-- DropIndex
DROP INDEX "auth_roles_name_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AuthPermissionToAuthRole";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "auth_permissions";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "auth_roles";
PRAGMA foreign_keys=on;

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
    CONSTRAINT "user_accounts_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "personal_details" ("personal_detail_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "user_accounts_user_account_status_id_fkey" FOREIGN KEY ("user_account_status_id") REFERENCES "user_account_statuses" ("user_account_status_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_user_accounts" ("created_at", "is_verified", "password", "personal_id", "updated_at", "user_account_id", "user_account_status_id") SELECT "created_at", "is_verified", "password", "personal_id", "updated_at", "user_account_id", "user_account_status_id" FROM "user_accounts";
DROP TABLE "user_accounts";
ALTER TABLE "new_user_accounts" RENAME TO "user_accounts";
CREATE UNIQUE INDEX "user_accounts_personal_id_key" ON "user_accounts"("personal_id");
CREATE UNIQUE INDEX "user_accounts_user_account_status_id_key" ON "user_accounts"("user_account_status_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
