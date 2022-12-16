import { z } from "zod";
import { router, adminProcedure } from "../trpc";

export const rehearsalRouter = router({
  getWithId: adminProcedure
    .input(z.string().cuid("Invalid CUID"))
    .query(async ({ ctx, input }) => {
      const rehearsal = await ctx.prisma.rehearsal.findUnique({
        where: { id: input },
        include: {
          corpsii: {
            select: {
              corps: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      });
      
      if (!rehearsal) {
        throw new Error("Rehearsal not found");
      }

      const corpsIds = rehearsal.corpsii.map((corps) => corps.corps.id) ?? [];
      return {
        id: rehearsal.id,
        title: rehearsal.title,
        date: rehearsal.date,
        corpsIds,
      };
    }),

  upsert: adminProcedure
    .input(z.object({
      id: z.string().cuid("Invalid CUID").optional(),
      title: z.string(),
      date: z.date(),
      corpsIds: z.array(z.string().cuid("Invalid CUID")).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, title, date, corpsIds } = input;
      // Remove all corpsRehearsals for this rehearsal if updating an existing rehearsal
      if (id) {
        await ctx.prisma.corpsRehearsal.deleteMany({
          where: { rehearsalId: id },
        });
      }
      const data = {
        title,
        date,
        corps: {
          connect: corpsIds?.map((corpsId) => ({ id: corpsId })) ?? [],
        },
      };
      const rehearsal = await ctx.prisma.rehearsal.upsert({
        where: { id: id ?? "" },
        create: data,
        update: data,
      });
      return rehearsal;
    }),

  updateAttendance: adminProcedure
    .input(z.object({
      rehearsalId: z.string().cuid("Invalid CUID"),
      corpsIds: z.array(z.string().cuid("Invalid CUID")),
    }))
    .mutation(async ({ ctx, input }) => {
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
