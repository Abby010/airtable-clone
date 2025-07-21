import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const columnRouter = createTRPCRouter({
  getByTable: protectedProcedure.input(z.object({ tableId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.column.findMany({
      where: { tableId: input.tableId },
      orderBy: { order: "asc" },
    });
  }),
  create: protectedProcedure.input(z.object({ tableId: z.string(), name: z.string().min(1), type: z.string().min(1), order: z.number() })).mutation(async ({ ctx, input }) => {
    return ctx.db.column.create({
      data: {
        tableId: input.tableId,
        name: input.name,
        type: input.type,
        order: input.order,
      },
    });
  }),
  delete: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.column.delete({ where: { id: input.id } });
  }),
}); 