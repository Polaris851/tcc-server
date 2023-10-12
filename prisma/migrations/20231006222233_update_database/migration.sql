/*
  Warnings:

  - You are about to drop the `days` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "days";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discipline" TEXT NOT NULL,
    "field" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "class_times" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "discipline_id" TEXT NOT NULL,
    "classDate" DATETIME NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    CONSTRAINT "class_times_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "dueDate" DATETIME NOT NULL,
    "alertDate" DATETIME,
    "description" TEXT
);

-- CreateTable
CREATE TABLE "week_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT
);
