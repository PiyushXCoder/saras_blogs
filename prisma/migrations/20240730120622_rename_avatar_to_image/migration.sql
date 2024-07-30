/*
  Warnings:

  - You are about to drop the column `avatar` on the `Author` table. All the data in the column will be lost.
  - Added the required column `image` to the `Author` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Author` DROP COLUMN `avatar`,
    ADD COLUMN `image` VARCHAR(191) NOT NULL;
