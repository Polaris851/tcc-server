-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_day_homeworks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "day_id" TEXT NOT NULL,
    "homework_id" TEXT NOT NULL,
    CONSTRAINT "day_homeworks_day_id_fkey" FOREIGN KEY ("day_id") REFERENCES "days" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "day_homeworks_homework_id_fkey" FOREIGN KEY ("homework_id") REFERENCES "homeworks" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_day_homeworks" ("day_id", "homework_id", "id") SELECT "day_id", "homework_id", "id" FROM "day_homeworks";
DROP TABLE "day_homeworks";
ALTER TABLE "new_day_homeworks" RENAME TO "day_homeworks";
CREATE UNIQUE INDEX "day_homeworks_day_id_homework_id_key" ON "day_homeworks"("day_id", "homework_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
