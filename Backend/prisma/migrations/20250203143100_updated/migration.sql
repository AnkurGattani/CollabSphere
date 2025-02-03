/*
  Warnings:

  - You are about to drop the `AIChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIChat" DROP CONSTRAINT "AIChat_userId_fkey";

-- DropTable
DROP TABLE "AIChat";

-- CreateTable
CREATE TABLE "AiChat" (
    "chatId" TEXT NOT NULL,
    "chatName" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "messages" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiChat_pkey" PRIMARY KEY ("chatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiChat_chatId_userId_key" ON "AiChat"("chatId", "userId");

-- AddForeignKey
ALTER TABLE "AiChat" ADD CONSTRAINT "AiChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
