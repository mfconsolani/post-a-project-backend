/*
  Warnings:

  - The `owner` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_owner_fkey";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "owner",
ADD COLUMN     "owner" INTEGER;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_fkey" FOREIGN KEY ("owner") REFERENCES "CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
