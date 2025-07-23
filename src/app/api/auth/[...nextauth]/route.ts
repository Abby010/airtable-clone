import { handlers } from "~/server/auth";

// Use Node.js runtime
export const runtime = "nodejs";

// Export GET and POST handlers
export const { GET, POST } = handlers;
