import dynamic from 'next/dynamic';

const PersonalStats = dynamic(
  () => import('../../../../components/personal-stats'),
);

const StatsForNerds = () => {
  return <PersonalStats />;
};

export default StatsForNerds;
