import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

// Check if we're in an Edge runtime
const isEdgeRuntime = process.env.NEXT_RUNTIME === 'edge';

const createPrismaClient = () => {
  if (isEdgeRuntime) {
    throw new Error(
      'PrismaClient cannot be used in Edge Runtime. Please use Node.js runtime for routes that require database access.'
    );
  }

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

// In development, we want to use a single connection
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Only create a new client if we're not in Edge runtime
export const db = !isEdgeRuntime
  ? (globalForPrisma.prisma ?? createPrismaClient())
  : undefined;

if (env.NODE_ENV !== "production" && !isEdgeRuntime) {
  globalForPrisma.prisma = db;
}
