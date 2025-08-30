import { Metadata } from 'next';
import SetGame from './set';

export const metadata: Metadata = {
  title: 'Set',
}

const SetPage = () => {
  return <SetGame />;
};

export default SetPage;
