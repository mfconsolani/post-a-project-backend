/*
  Warnings:

  - A unique constraint covering the columns `[avatar]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[resume]` on the table `UserProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_avatar_key" ON "UserProfile"("avatar");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_resume_key" ON "UserProfile"("resume");
