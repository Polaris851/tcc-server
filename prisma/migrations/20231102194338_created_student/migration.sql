-- CreateEnum
CREATE TYPE "CourseEnum" AS ENUM ('Quimica', 'Mecatronica', 'Redes');

-- AlterTable
ALTER TABLE "times_disciplines" ALTER COLUMN "startTime" SET DATA TYPE TIME,
ALTER COLUMN "endTime" SET DATA TYPE TIME;

-- AlterTable
ALTER TABLE "times_week_activities" ALTER COLUMN "startTime" SET DATA TYPE TIME,
ALTER COLUMN "endTime" SET DATA TYPE TIME;

-- CreateTable
CREATE TABLE "students" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "course" "CourseEnum" NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "students_pkey" PRIMARY KEY ("id")
);
