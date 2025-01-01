import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to database");
  } catch (error) {
    console.log("Error occurred while connecting to database", error);
    process.exit(1);
  }
};

export { prisma, connectDB };
