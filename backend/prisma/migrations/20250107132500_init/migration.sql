-- CreateTable
CREATE TABLE "personal_details" (
    "personal_detail_id" TEXT NOT NULL PRIMARY KEY,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "user_accounts" (
    "user_account_id" TEXT NOT NULL PRIMARY KEY,
    "password" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_email_key" ON "personal_details"("email");

-- CreateIndex
CREATE UNIQUE INDEX "personal_details_phone_number_key" ON "personal_details"("phone_number");
