import BloodOnTheClocktowerElement, {
  GameState,
} from './blood-on-the-clocktower';

interface BloodOnTheClocktowerProps {
  searchParams?: {
    state?: string;
  };
}

const BloodOnTheClocktowerPage = ({
  searchParams,
}: BloodOnTheClocktowerProps) => {
  const initialState = searchParams?.state
    ? (JSON.parse(searchParams.state) as GameState)
    : undefined;
  return <BloodOnTheClocktowerElement state={initialState} />;
};

export default BloodOnTheClocktowerPage;
