import HomePage from './home-page';
import { prisma } from 'server/db/client';

const RootPage = async () => {
  const currentDate = new Date(
    new Date().toISOString().split('T')[0] ?? '2021-01-01',
  );
  // const gigs = await api.gig.getMany.query({ startDate: currentDate });

  const gigs = await prisma.gig.findMany({
    include: {
      type: {
        select: {
          name: true,
        },
      },
      hiddenFor: {
        select: {
          corpsId: true,
        },
      },
    },
    where: {
      date: {
        gte: currentDate,
      },
    },
    orderBy: {
      date: 'asc',
    },
  });
  return <HomePage gigs={gigs} />;
};

export default RootPage;
