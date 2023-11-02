/*
  Warnings:

  - You are about to drop the `times` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "times" DROP CONSTRAINT "times_discipline_id_fkey";

-- DropForeignKey
ALTER TABLE "times" DROP CONSTRAINT "times_weekActivity_id_fkey";

-- DropTable
DROP TABLE "times";

-- CreateTable
CREATE TABLE "times_week_activities" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeekEnum" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "week_activity_id" TEXT NOT NULL,

    CONSTRAINT "times_week_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "times_disciplines" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeekEnum" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "discipline_id" TEXT NOT NULL,

    CONSTRAINT "times_disciplines_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "times_week_activities" ADD CONSTRAINT "times_week_activities_week_activity_id_fkey" FOREIGN KEY ("week_activity_id") REFERENCES "week_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "times_disciplines" ADD CONSTRAINT "times_disciplines_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
