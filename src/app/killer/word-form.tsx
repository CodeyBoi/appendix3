'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from 'trpc/react';

const KillerWordForm = () => {
  const router = useRouter();
  const mutation = api.killer.kill.useMutation();

  const [word, setWord] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await mutation.mutateAsync({ word });
    if (res.success) {
      setWord('');
      setError(null);
      router.refresh();
    } else {
      setError('Fel kodord, försök igen!');
    }
  };

  return (
    <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
      Har du dödat någon? Fyll i ordet som stod på deras lapp här:
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
          Skicka
        </button>
      </div>
      {error && <div className='text-red-600'>{error}</div>}
    </form>
  );
};

export default KillerWordForm;
