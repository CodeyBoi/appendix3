import BloodOnTheClocktowerElement from './blood-on-the-clocktower';

interface BloodOnTheClocktowerProps {
  searchParams?: {
    state?: string;
  };
}

const BloodOnTheClocktowerPage = ({
  searchParams,
}: BloodOnTheClocktowerProps) => {
  const initialState = searchParams?.state
    ? JSON.parse(searchParams.state)
    : undefined;
  return <BloodOnTheClocktowerElement state={initialState} />;
};

export default BloodOnTheClocktowerPage;
