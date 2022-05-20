-- CreateTable
CREATE TABLE "_RolesToUserProfile" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RolesToUserProfile_AB_unique" ON "_RolesToUserProfile"("A", "B");

-- CreateIndex
CREATE INDEX "_RolesToUserProfile_B_index" ON "_RolesToUserProfile"("B");

-- AddForeignKey
ALTER TABLE "_RolesToUserProfile" ADD FOREIGN KEY ("A") REFERENCES "Roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RolesToUserProfile" ADD FOREIGN KEY ("B") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
