/*
  Warnings:

  - Made the column `owner` on table `Project` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_owner_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "owner" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_fkey" FOREIGN KEY ("owner") REFERENCES "CompanyProfile"("companyEmail") ON DELETE RESTRICT ON UPDATE CASCADE;
