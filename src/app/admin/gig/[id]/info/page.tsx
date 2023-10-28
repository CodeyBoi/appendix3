import GigSkeleton from 'components/gig/skeleton';
import { api } from 'trpc/server';
import { Suspense } from 'react';
import GigCard from 'components/gig/card';
import FoodPrefs from 'components/signup-list/food-prefs';

const GigAdminInfo = async ({ params }: { params: { id: string } }) => {
  const gigId = params.id;

  const [gig, signups] = await Promise.all([
    api.gig.getWithId.query({ gigId }),
    api.gig.getSignups.query({ gigId }),
  ]);

  const corpsIds = signups?.map((signup) => signup.corpsId);

  const foodPrefs = await api.corps.getFoodPreferences.query({
    corpsIds: corpsIds as string[],
  });

  return (
    <div className='max-w-4xl'>
      <Suspense fallback={<GigSkeleton />}>
        <GigCard gig={gigId} />
      </Suspense>
      <div className='h-2' />
      {gig && (
        <FoodPrefs
          gigTitle={gig.title}
          checkbox1={gig.checkbox1.trim() || undefined}
          checkbox2={gig.checkbox2.trim() || undefined}
          signups={signups}
          foodPrefs={foodPrefs}
        />
      )}
    </div>
  );
};

export default GigAdminInfo;
