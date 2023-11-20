/*
  Warnings:

  - Added the required column `student_id` to the `disciplines` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `homeworks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `student_id` to the `week_activities` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "disciplines" ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "homeworks" ADD COLUMN     "student_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "week_activities" ADD COLUMN     "student_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "homeworks" ADD CONSTRAINT "homeworks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "week_activities" ADD CONSTRAINT "week_activities_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disciplines" ADD CONSTRAINT "disciplines_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
