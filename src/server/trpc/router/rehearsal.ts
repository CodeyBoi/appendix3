import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const rehearsalRouter = router({
  get: adminProcedure
    .input(z.string().cuid("Invalid CUID"))
    .query(async ({ ctx, input }) => {
      const rehearsal = await ctx.prisma.rehearsal.findUnique({
        where: { id: input },
      });
      return rehearsal;
    }),

  create: adminProcedure
    .input(z.object({
      title: z.string(),
      date: z.date(),
      corpsIds: z.array(z.string().cuid("Invalid CUID")).optional(),
    }))
    .query(async ({ ctx, input }) => {
      const { title, date, corpsIds } = input;
      const rehearsal = await ctx.prisma.rehearsal.create({
        data: {
          title,
          date,
          corpsii: {
            createMany: {
              data: corpsIds?.map((corpsId) => ({
                corpsId,
              })) ?? [],
            },
          },
        },
      });
      return rehearsal;
    }),

  updateAttendance: adminProcedure
    .input(z.object({
      rehearsalId: z.string().cuid("Invalid CUID"),
      corpsIds: z.array(z.string().cuid("Invalid CUID")),
    }))
    .query(async ({ ctx, input }) => {
      const { rehearsalId, corpsIds } = input;
      await ctx.prisma.corpsRehearsal.deleteMany({
        where: { rehearsalId },
      });
      await ctx.prisma.corpsRehearsal.createMany({
        data: corpsIds.map((corpsId) => ({
          corpsId,
          rehearsalId,
        })),
      });
      const rehearsal = await ctx.prisma.rehearsal.findUnique({
        where: { id: rehearsalId },
      });
      return rehearsal;
    }),
});
