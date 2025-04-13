-- CreateTable
CREATE TABLE "feedback_statuses" (
    "feedback_status_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_feedbacks" (
    "feedback_id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedback_status_id" INTEGER,
    "bookingId" INTEGER,
    CONSTRAINT "feedbacks_feedback_status_id_fkey" FOREIGN KEY ("feedback_status_id") REFERENCES "feedback_statuses" ("feedback_status_id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "feedbacks_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings" ("booking_id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_feedbacks" ("bookingId", "created_at", "feedback_id", "name", "text", "updated_at") SELECT "bookingId", "created_at", "feedback_id", "name", "text", "updated_at" FROM "feedbacks";
DROP TABLE "feedbacks";
ALTER TABLE "new_feedbacks" RENAME TO "feedbacks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
