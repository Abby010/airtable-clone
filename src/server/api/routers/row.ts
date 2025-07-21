import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const rowRouter = createTRPCRouter({
  getByTable: protectedProcedure.input(z.object({ tableId: z.string(), cursor: z.string().nullish(), limit: z.number().min(1).max(1000).default(100) })).query(async ({ ctx, input }) => {
    const rows = await ctx.db.row.findMany({
      where: { tableId: input.tableId },
      orderBy: { createdAt: "asc" },
      take: input.limit,
      skip: input.cursor ? 1 : 0,
      cursor: input.cursor ? { id: input.cursor } : undefined,
      include: { cells: true },
    });
    const nextCursor = rows.length === input.limit ? rows[rows.length - 1].id : null;
    return { rows, nextCursor };
  }),
  create: protectedProcedure.input(z.object({ tableId: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.row.create({
      data: {
        tableId: input.tableId,
      },
    });
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.row.delete({ where: { id: input.id } });
  }),
}); 