import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tableRouter = createTRPCRouter({
  getByBase: protectedProcedure.input(z.object({ baseId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.table.findMany({
      where: { baseId: input.baseId },
      orderBy: { createdAt: "asc" },
    });
  }),
  create: protectedProcedure.input(z.object({ baseId: z.string(), name: z.string().min(1) })).mutation(async ({ ctx, input }) => {
    return ctx.db.table.create({
      data: {
        name: input.name,
        baseId: input.baseId,
      },
    });
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.table.delete({ where: { id: input.id } });
  }),
}); 