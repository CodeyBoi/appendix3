import { api } from 'trpc/server';
import { lang } from 'utils/language';

type VotationResultsProps = {
  id: number;
};

const VotationResults = async ({ id }: VotationResultsProps) => {
  const results = await api.votation.getResult.query({ id });
  return (
    <div className='rounded border p-4 shadow-md dark:border-neutral-800'>
      <h3 className='pb-2'>{lang('Röstningsresultat', 'Votation results')}</h3>
      <div className='ml-2 flex flex-col gap-2'>
        {results.map((result) => (
          <div key={result.id}>
            {result.votes}
            {lang(
              result.votes == 1 ? ' röst för ' : ' röster för ',
              result.votes == 1 ? ' vote for ' : ' votes for ',
            )}
            {result.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotationResults;
