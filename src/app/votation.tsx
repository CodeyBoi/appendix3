'use client';

import Countdown from 'components/countdown';
import Button from 'components/input/button';
import Checkbox from 'components/input/checkbox';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { api } from 'trpc/react';

type Option = {
  id: number;
  name: string;
};

type VotationProps = {
  votation: {
    endsAt: Date;
    options: Option[];
    hasVoted: boolean;
  };
};

const Votation = ({ votation }: VotationProps) => {
  const router = useRouter();
  const [choices, setChoices] = useState<number[]>([]);

  const mutation = api.votation.vote.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const handleSubmit = async () => {
    await mutation.mutateAsync({ votationItemIds: choices });
  };

  return (
    <div className='rounded border p-4 shadow-md dark:border-neutral-800'>
      <h3 className='pb-2'>
        Röstning stänger om <Countdown end={votation.endsAt} />
      </h3>
      <div className='ml-2 flex flex-col gap-2'>
        {votation.options.map((option) => (
          <Checkbox
            key={option.id}
            label={option.name}
            onChange={(e) => {
              const isChecked = e.currentTarget.checked;
              setChoices((old) => {
                console.log({ old });
                if (isChecked) {
                  return [...old, option.id];
                } else {
                  return old.filter((v) => v != option.id);
                }
              });
            }}
          />
        ))}
      </div>
      <div className='h-4' />
      <Button onClick={handleSubmit}>Skicka!</Button>
    </div>
  );
};

export default Votation;
