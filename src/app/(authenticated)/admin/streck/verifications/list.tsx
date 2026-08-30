'use client';

import Loading from 'components/loading';
import { api } from 'trpc/react';
import { RouterOutputs } from 'trpc/shared';
import { lang } from 'utils/language';

const VerificationTable = ({
  verifications: verificationData,
}: {
  verifications?: RouterOutputs['streck']['getTransactions'];
}) => {
  if (!verificationData) {
    return (
      <Loading msg={lang('Hämtar verifikat...', 'Fetching verifications...')} />
    );
  }

  const _verifications = verificationData.data.flatMap((_transaction) => {
    return (
      <td>
        <thead></thead>
      </td>
    );
  });

  return <table></table>;
};

interface VerificationsListProps {
  start?: Date;
  end?: Date;
}

const VerificationsList = ({ start, end }: VerificationsListProps) => {
  const { data: verificationsData } = api.streck.getTransactions.useQuery({
    start,
    end,
  });

  return (
    <div className='flex flex-col'>
      <h2>{lang('Verifikat', 'Verifications')}</h2>
      <VerificationTable verifications={verificationsData} />
    </div>
  );
};

export default VerificationsList;
