/*
  Warnings:

  - You are about to drop the `_ProjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_B_fkey";

-- DropTable
DROP TABLE "_ProjectToUser";

-- CreateTable
CREATE TABLE "_LikesRegistered" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ApplicationsRegistered" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LikesRegistered_AB_unique" ON "_LikesRegistered"("A", "B");

-- CreateIndex
CREATE INDEX "_LikesRegistered_B_index" ON "_LikesRegistered"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ApplicationsRegistered_AB_unique" ON "_ApplicationsRegistered"("A", "B");

-- CreateIndex
CREATE INDEX "_ApplicationsRegistered_B_index" ON "_ApplicationsRegistered"("B");

-- AddForeignKey
ALTER TABLE "_LikesRegistered" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LikesRegistered" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationsRegistered" ADD FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApplicationsRegistered" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
