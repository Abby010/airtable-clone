import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const createPrismaClient = () => {
  console.log("Creating Prisma Client with env:", {
    nodeEnv: env.NODE_ENV,
    databaseUrl: env.DATABASE_URL?.slice(0, 20) + '...',  // Log partial URL for safety
  });

  const client = new PrismaClient({
    log: ["error", "warn"],
    errorFormat: 'pretty',
  });

  // Test the connection
  client.$connect()
    .then(() => {
      console.log('Successfully connected to database');
    })
    .catch((e) => {
      console.error('Failed to connect to database:', e);
    });

  return client;
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;
