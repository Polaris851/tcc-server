/*
  Warnings:

  - You are about to drop the `class_times` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `disciplines` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "class_times";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "disciplines";
PRAGMA foreign_keys=on;
