'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from 'trpc/react';
import { lang } from 'utils/language';

const KillerWordForm = () => {
  const router = useRouter();
  const mutation = api.killer.kill.useMutation({
    onSuccess: (res) => {
      if (res.success) {
        setWord('');
        setError(null);
        router.refresh();
      } else {
        setError(
          lang(
            'Ogiltigt kodord, försök igen!',
            'Invalid code word, try again!',
          ),
        );
      }
    },
  });

  const [word, setWord] = useState<string>('');
  const [error, setError] = useState<React.ReactNode | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate({ word });
  };

  return (
    <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
      {lang(
        'Har du dödat någon? Fyll i ordet som stod på deras lapp här:',
        'Have you killed someone? Fill in the word that was on their note here:',
      )}
      <div className='flex w-full gap-2'>
        <input
          placeholder='Kodord'
          value={word}
          onChange={(e) => setWord(e.target.value)}
          name='word'
          type='text'
          className='grow rounded border border-gray-300 bg-white p-2 dark:border-gray-700'
        />
        <button
          type='submit'
          className='rounded bg-red-600 p-2 text-white hover:bg-red-700'
        >
          {lang('Skicka', 'Submit')}
        </button>
      </div>
      {error && <div className='text-red-600'>{error}</div>}
    </form>
  );
};

export default KillerWordForm;
