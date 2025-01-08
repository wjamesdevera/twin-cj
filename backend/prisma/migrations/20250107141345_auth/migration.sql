-- CreateTable
CREATE TABLE "auth_permissions" (
    "auth_permission_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "auth_roles" (
    "auth_role_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "password_reset_token_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "password_reset_tokens_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "personal_details" (
    "personal_detail_id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sessions" (
    "session_id" TEXT NOT NULL PRIMARY KEY,
    "user_account_id" TEXT,
    "user_agent" TEXT,
    "expires_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "sessions_user_account_id_fkey" FOREIGN KEY ("user_account_id") REFERENCES "user_accounts" ("user_account_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "user_account_id" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "personal_id" TEXT NOT NULL,
    "user_account_status_id" INTEGER,
    "authRoleId" INTEGER,
    CONSTRAINT "user_accounts_personal_id_fkey" FOREIGN KEY ("personal_id") REFERENCES "personal_details" ("personal_detail_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "user_accounts_user_account_status_id_fkey" FOREIGN KEY ("user_account_status_id") REFERENCES "user_account_statuses" ("user_account_status_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "user_accounts_authRoleId_fkey" FOREIGN KEY ("authRoleId") REFERENCES "auth_roles" ("auth_role_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "user_account_statuses" (
    "user_account_status_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_AuthPermissionToAuthRole" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_AuthPermissionToAuthRole_A_fkey" FOREIGN KEY ("A") REFERENCES "auth_permissions" ("auth_permission_id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_AuthPermissionToAuthRole_B_fkey" FOREIGN KEY ("B") REFERENCES "auth_roles" ("auth_role_id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "auth_permissions_name_key" ON "auth_permissions"("name");

-- CreateIndex
CREATE UNIQUE INDEX "auth_roles_name_key" ON "auth_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_user_account_id_key" ON "password_reset_tokens"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_email_key" ON "personal_details"("email");

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_phone_number_key" ON "personal_details"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_user_account_id_key" ON "sessions"("user_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_personal_id_key" ON "user_accounts"("personal_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_accounts_user_account_status_id_key" ON "user_accounts"("user_account_status_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_statuses_name_key" ON "user_account_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_AuthPermissionToAuthRole_AB_unique" ON "_AuthPermissionToAuthRole"("A", "B");

-- CreateIndex
CREATE INDEX "_AuthPermissionToAuthRole_B_index" ON "_AuthPermissionToAuthRole"("B");
