import { Metadata } from 'next';
import BlackjackGame from './blackjack-game';

export const metadata: Metadata = {
  title: 'Blackjack',
};

const BlackjackPage = () => {
  return <BlackjackGame />;
};

export default BlackjackPage;
