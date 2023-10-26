/*
  Warnings:

  - Changed the type of `field` on the `disciplines` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FieldEnum" AS ENUM ('Matematica', 'Naturezas', 'Humanas', 'Linguagens', 'Tecnico');

-- AlterTable
ALTER TABLE "disciplines" DROP COLUMN "field",
ADD COLUMN     "field" "FieldEnum" NOT NULL;
