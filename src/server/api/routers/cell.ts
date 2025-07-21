import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const cellRouter = createTRPCRouter({
  getByRow: protectedProcedure.input(z.object({ rowId: z.string() })).query(async ({ ctx, input }) => {
    return ctx.db.cell.findMany({
      where: { rowId: input.rowId },
    });
  }),
  update: protectedProcedure.input(z.object({ id: z.string(), value: z.string() })).mutation(async ({ ctx, input }) => {
    return ctx.db.cell.update({
      where: { id: input.id },
      data: { value: input.value },
    });
  }),
}); 