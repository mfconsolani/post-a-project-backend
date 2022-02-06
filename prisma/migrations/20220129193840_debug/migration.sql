-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_owner_fkey";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "owner" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_fkey" FOREIGN KEY ("owner") REFERENCES "CompanyProfile"("companyEmail") ON DELETE SET NULL ON UPDATE CASCADE;
