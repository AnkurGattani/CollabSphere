-- CreateTable
CREATE TABLE "AIChat" (
    "chatId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "messages" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIChat_pkey" PRIMARY KEY ("chatId")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIChat_chatId_userId_key" ON "AIChat"("chatId", "userId");

-- AddForeignKey
ALTER TABLE "AIChat" ADD CONSTRAINT "AIChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
