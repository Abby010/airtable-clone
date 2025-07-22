import { handlers } from "~/server/auth";

console.log('Auth Route Handler Initialized');

export const runtime = "edge";
export const { GET, POST } = handlers;
