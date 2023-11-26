/*
  Warnings:

  - You are about to drop the column `discipline` on the `events` table. All the data in the column will be lost.
  - Added the required column `discipline_id` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "events" DROP COLUMN "discipline",
ADD COLUMN     "discipline_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_discipline_id_fkey" FOREIGN KEY ("discipline_id") REFERENCES "disciplines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
