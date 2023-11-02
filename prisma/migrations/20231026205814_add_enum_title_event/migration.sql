-- CreateEnum
CREATE TYPE "FieldEnum" AS ENUM ('Matematica', 'Naturezas', 'Humanas', 'Linguagens', 'Tecnico');

-- CreateEnum
CREATE TYPE "TitleEnum" AS ENUM ('Prova', 'Seminario', 'Trabalho', 'Tarefa');

-- CreateTable
CREATE TABLE "homeworks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL,

    CONSTRAINT "homeworks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "title" "TitleEnum" NOT NULL,
    "discipline" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "alertDate" TIMESTAMP(3),
    "description" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_activities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "week_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disciplines" (
    "id" TEXT NOT NULL,
    "discipline" TEXT NOT NULL,
    "field" "FieldEnum" NOT NULL,

    CONSTRAINT "disciplines_pkey" PRIMARY KEY ("id")
);
