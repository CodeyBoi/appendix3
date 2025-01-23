'use client';

import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';
import Button from 'components/input/button';
import TextArea from 'components/input/text-area';
import TextInput from 'components/input/text-input';
import Restricted from 'components/restricted/client';

const defaultValues = {
  title: '',
  author: '',
  melody: '',
  lyrics: '',
};
type FormValues = typeof defaultValues;
interface SongFormProps {
  song?: FormValues & { id: string };
}

const SongForm = ({ song }: SongFormProps) => {
  const router = useRouter();
  const utils = api.useUtils();

  const newSong = !song;

  const form = useForm<FormValues>({
    initialValues: newSong
      ? defaultValues
      : {
          title: song.title,
          author: song.author,
          melody: song.melody,
          lyrics: song.lyrics,
        },
    validate: {
      title: (title) => (title ? null : 'Fyll i titel'),
      lyrics: (lyrics) => (lyrics ? null : 'Fyll i text'),
    },
  });

  const mutation = api.song.upsert.useMutation({
    onSuccess: async ({ id }) => {
      if (song) {
        await utils.song.get.invalidate({ id });
      }
      await utils.song.getAll.invalidate();
      router.push(`/songs/${id}`);
    },
  });
  const handleSubmit = (values: FormValues) => {
    if (newSong) {
      mutation.mutate(values);
    } else {
      mutation.mutate({ ...values, id: song.id });
    }
  };

  const removeMutation = api.song.remove.useMutation({
    onSuccess: async () => {
      if (song) {
        await utils.song.get.invalidate({ id: song.id });
      }
      await utils.song.getAll.invalidate();
      router.push('/songs');
    },
  });

  return (
    <form style={{ width: '100%' }} onSubmit={form.onSubmit(handleSubmit)}>
      <div className='flex flex-col gap-4'>
        <TextInput
          label='Titel'
          withAsterisk
          spellCheck={false}
          {...form.getInputProps('title')}
        />
        <TextInput
          label='Författare'
          spellCheck={false}
          {...form.getInputProps('author')}
        />
        <TextInput
          label='Melodi'
          spellCheck={false}
          {...form.getInputProps('melody')}
        />
        <TextArea
          label='Sångtext'
          withAsterisk
          autoSize
          {...form.getInputProps('lyrics')}
        />
        <div className='flex items-center justify-end gap-4'>
          {song && (
            <Restricted permissions={'manageCorps'}>
              <Button
                className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
                color='transparent'
                compact
                onClick={() => {
                  if (
                    window.confirm('Är du säker på att du vill ta bort sången?')
                  ) {
                    removeMutation.mutate({ id: song.id });
                  }
                }}
              >
                RADERA SÅNG
              </Button>
            </Restricted>
          )}
          <Button type='submit'>
            {(newSong ? 'Skapa' : 'Uppdatera') + ' sång'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SongForm;
