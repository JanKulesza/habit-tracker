/*
  Warnings:

  - Added the required column `icon` to the `habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habit" ADD COLUMN     "frequency" TEXT NOT NULL DEFAULT 'daily',
ADD COLUMN     "icon" TEXT NOT NULL;
