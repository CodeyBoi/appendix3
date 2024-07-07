import { api } from 'trpc/server';
import Votation from './votation';

const VotingPage = async () => {
  const votation = await api.votation.getCurrent.query();

  if (votation) {
    return <Votation votation={votation} />;
  } else {
    return <div>Ingen pågående röstning.</div>;
  }
};

export default VotingPage;
