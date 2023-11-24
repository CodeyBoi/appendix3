import { z } from 'zod';
import { router, restrictedProcedure } from '../trpc';

export const sectionRouter = router({
  getSectionLeader: restrictedProcedure('manageSections')
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { sectionId } = input;
      const section = await ctx.prisma.section.findUnique({
        where: { id: sectionId },
        include: {
          leader: true,
        },
      });
      return section?.leader;
    }),

  getSectionLeaders: restrictedProcedure('manageSections').query(
    async ({ ctx }) => {
      return await ctx.prisma.section.findMany({
        include: {
          leader: true,
        },
      });
    },
  ),

  setSectionLeader: restrictedProcedure('manageSections')
    .input(z.object({ sectionId: z.number(), corpsId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { sectionId, corpsId } = input;
      const section = await ctx.prisma.section.update({
        where: { id: sectionId },
        data: {
          leader: {
            connect: {
              id: corpsId,
            },
          },
        },
      });
      return section;
    }),
});
