import { useRouter } from 'next/router';
import Loading from 'components/loading';
import { trpc } from 'utils/trpc';
import GigSkeleton from 'components/gig/skeleton';
import dynamic from 'next/dynamic';

const GigCard = dynamic(() => import('components/gig/card'), {
  loading: () => <GigSkeleton />,
});
const FoodPrefs = dynamic(() => import('components/signup-list/food-prefs'));

const GigAdminInfo = () => {
  const router = useRouter();
  const gigId = router.query.id as string;
  const { data: gig } = trpc.gig.getWithId.useQuery({ gigId });
  const { data: signups } = trpc.gig.getSignups.useQuery({ gigId });

  const corpsIds = signups?.map((signup) => signup.corpsId);

  const { data: foodPrefs } = trpc.corps.getFoodPreferences.useQuery(
    {
      corpsIds: corpsIds as string[],
    },
    {
      enabled: !!corpsIds,
    },
  );

  return (
    <div className='max-w-4xl'>
      {gig ? <GigCard gig={gig} /> : <Loading msg='Laddar spelning...' />}
      <div className='h-2' />
      {signups && foodPrefs && gig && (
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
