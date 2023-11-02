-- CreateEnum
CREATE TYPE "DayOfWeekEnum" AS ENUM ('Segunda', 'Terca', 'Quarta', 'Quinta', 'Sexta');

-- CreateTable
CREATE TABLE "times" (
    "id" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeekEnum" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "weekActivity_id" TEXT NOT NULL,
    "discipline_id" TEXT NOT NULL,

    CONSTRAINT "times_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "times" ADD CONSTRAINT "times_weekActivity_id_fkey" FOREIGN KEY ("weekActivity_id") REFERENCES "week_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "times" ADD CONSTRAINT "times_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
