/*
  Warnings:

  - Added the required column `goal` to the `habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "habit" ADD COLUMN     "goal" TEXT NOT NULL;
