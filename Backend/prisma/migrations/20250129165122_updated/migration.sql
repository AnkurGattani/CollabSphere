/*
  Warnings:

  - Added the required column `chatName` to the `AIChat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AIChat" ADD COLUMN     "chatName" TEXT NOT NULL;
