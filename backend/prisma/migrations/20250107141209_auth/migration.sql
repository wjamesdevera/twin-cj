/*
  Warnings:

  - You are about to drop the `personal_details` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_accounts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "personal_details";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_accounts";
PRAGMA foreign_keys=on;
