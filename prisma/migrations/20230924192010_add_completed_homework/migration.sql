/*
  Warnings:

  - You are about to drop the `day_homeworks` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `completed` to the `homeworks` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "day_homeworks_day_id_homework_id_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "day_homeworks";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_homeworks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL,
    "completed" BOOLEAN NOT NULL
);
INSERT INTO "new_homeworks" ("created_at", "id", "title") SELECT "created_at", "id", "title" FROM "homeworks";
DROP TABLE "homeworks";
ALTER TABLE "new_homeworks" RENAME TO "homeworks";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
