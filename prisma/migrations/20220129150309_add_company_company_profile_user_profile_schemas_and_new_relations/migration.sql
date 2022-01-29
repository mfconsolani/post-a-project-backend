/*
  Warnings:

  - Added the required column `owner` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('USER', 'COMPANY');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "owner" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gdprPolicy" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "profileType" "ProfileType" NOT NULL DEFAULT E'USER',
ADD COLUMN     "role" "SystemRole" NOT NULL DEFAULT E'USER';

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" SERIAL NOT NULL,
    "userEmail" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "birthday" TIMESTAMP(3),
    "phoneNumber" INTEGER,
    "city" TEXT,
    "country" TEXT,
    "description" TEXT,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gdprPolicy" BOOLEAN NOT NULL DEFAULT false,
    "role" "SystemRole" NOT NULL DEFAULT E'USER',
    "profileType" "ProfileType" NOT NULL DEFAULT E'COMPANY',

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" SERIAL NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "industry" TEXT,
    "phoneNumber" INTEGER,
    "employees" TEXT,
    "description" TEXT,
    "country" TEXT,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_SkillsToUserProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userEmail_key" ON "UserProfile"("userEmail");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_companyEmail_key" ON "CompanyProfile"("companyEmail");

-- CreateIndex
CREATE UNIQUE INDEX "_SkillsToUserProfile_AB_unique" ON "_SkillsToUserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_SkillsToUserProfile_B_index" ON "_SkillsToUserProfile"("B");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_fkey" FOREIGN KEY ("owner") REFERENCES "CompanyProfile"("companyEmail") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyProfile" ADD CONSTRAINT "CompanyProfile_companyEmail_fkey" FOREIGN KEY ("companyEmail") REFERENCES "Company"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToUserProfile" ADD FOREIGN KEY ("A") REFERENCES "Skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SkillsToUserProfile" ADD FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
