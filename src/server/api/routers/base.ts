import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateFakeRows } from "~/fakeData";

export const baseRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User session not found",
      });
    }

    return ctx.db.base.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }),
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.base.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Create the base
      const base = await ctx.db.base.create({
        data: {
          name: input.name,
          userId: ctx.session.user.id,
        },
      });

      // Create a default table for the base
      const table = await ctx.db.table.create({
        data: {
          name: "Grid view",
          baseId: base.id,
        },
      });

      // Default columns
      const columns = [
        { id: "col-checkbox", name: "", type: "checkbox", order: 0 },
        { id: "col-1", name: "Task Name", type: "text", order: 1 },
        { id: "col-2", name: "Description", type: "text", order: 2 },
        { id: "col-3", name: "Assigned To", type: "text", order: 3 },
        { id: "col-4", name: "Status", type: "text", order: 4 },
        { id: "col-5", name: "Priority", type: "text", order: 5 },
        { id: "col-6", name: "Due Date", type: "text", order: 6 },
      ];
      await ctx.db.column.createMany({
        data: columns.map((col) => ({
          ...col,
          tableId: table.id,
        })),
      });

      // Fake rows (reduced to 2 for speed)
      const fakeRows = generateFakeRows(2);
      // Batch create rows
      const createdRows = await ctx.db.row.createMany({
        data: fakeRows.map(() => ({ tableId: table.id })),
      });
      // Fetch the created row IDs (in order)
      const rowRecords = await ctx.db.row.findMany({
        where: { tableId: table.id },
        orderBy: { createdAt: "asc" },
        take: fakeRows.length,
      });
      // Batch create cells
      const cellsToCreate = rowRecords.flatMap((row: { id: string }, i: number) => {
        const fakeRow = fakeRows[i];
        if (!fakeRow) return [];
        return Object.entries(fakeRow).map(([colId, value]) => ({
          rowId: row.id,
          columnId: colId,
          value: typeof value === "string" ? value : JSON.stringify(value),
        }));
      });
      if (cellsToCreate.length > 0) {
        await ctx.db.cell.createMany({ data: cellsToCreate });
      }

      // Fetch the base with its tables (correct Prisma include syntax)
      const fullBase = await ctx.db.base.findUnique({
        where: { id: base.id },
        include: { tables: true },
      });
      return fullBase;
    }),
});
