/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToRoles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_PostToSkills` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[role]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[skill]` on the table `Skills` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_PostToRoles" DROP CONSTRAINT "_PostToRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToRoles" DROP CONSTRAINT "_PostToRoles_B_fkey";

-- DropForeignKey
ALTER TABLE "_PostToSkills" DROP CONSTRAINT "_PostToSkills_A_fkey";

-- DropForeignKey
ALTER TABLE "_PostToSkills" DROP CONSTRAINT "_PostToSkills_B_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "_PostToRoles";

-- DropTable
DROP TABLE "_PostToSkills";

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresBy" TIMESTAMP(3) NOT NULL,
    "likesCount" INTEGER NOT NULL,
    "location" TEXT NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProjectToRoles" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ProjectToSkills" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToRoles_AB_unique" ON "_ProjectToRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToRoles_B_index" ON "_ProjectToRoles"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProjectToSkills_AB_unique" ON "_ProjectToSkills"("A", "B");

-- CreateIndex
CREATE INDEX "_ProjectToSkills_B_index" ON "_ProjectToSkills"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_role_key" ON "Roles"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Skills_skill_key" ON "Skills"("skill");

-- AddForeignKey
ALTER TABLE "_ProjectToRoles" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToRoles" ADD FOREIGN KEY ("B") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToSkills" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectToSkills" ADD FOREIGN KEY ("B") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;
