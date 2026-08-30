import dayjs from 'dayjs';
import VerificationsList from './list';

const VerificationsPage = () => {
  return (
    <VerificationsList
      start={dayjs().subtract(1, 'month').toDate()}
      end={new Date()}
    />
  );
};

export default VerificationsPage;
