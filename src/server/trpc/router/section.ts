import { z } from 'zod';
import { router, restrictedProcedure } from '../trpc';
import { filterNone } from 'utils/array';

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

      // Sync section leader permission roles
      const sectionLeaderRole = await ctx.prisma.role.findUnique({
        where: {
          name: 'Stämledare',
        },
      });
      if (sectionLeaderRole) {
        // Remove "Stämledare" role from all corps
        const oldSectionLeaders = await ctx.prisma.corps.findMany({
          select: {
            id: true,
          },
          where: {
            roles: {
              some: {
                id: sectionLeaderRole.id,
              },
            },
          },
        });
        await Promise.all(
          oldSectionLeaders.map((leader) =>
            ctx.prisma.corps.update({
              where: {
                id: leader.id,
              },
              data: {
                roles: {
                  disconnect: {
                    id: sectionLeaderRole.id,
                  },
                },
              },
            }),
          ),
        );

        // Readd all "Stämledare" roles
        const sections = await ctx.prisma.section.findMany({
          select: {
            leader: {
              select: {
                id: true,
              },
            },
          },
        });
        const leaders = filterNone(sections.map((section) => section.leader));
        await Promise.all(
          leaders.map((leader) =>
            ctx.prisma.corps.update({
              where: {
                id: leader.id,
              },
              data: {
                roles: {
                  connect: {
                    id: sectionLeaderRole.id,
                  },
                },
              },
            }),
          ),
        );
      }

      return section;
    }),
});
