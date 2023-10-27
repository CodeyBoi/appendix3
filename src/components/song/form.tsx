import { Button, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';

const defaultValues = {
  title: '',
  author: '',
  melody: '',
  lyrics: '',
};
type FormValues = typeof defaultValues;
type SongFormProps = {
  song?: FormValues & { id: string };
};

const SongForm = ({ song }: SongFormProps) => {
  const router = useRouter();
  const utils = trpc.useContext();

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

  const mutation = trpc.song.upsert.useMutation({
    onSuccess: () => {
      if (song) {
        utils.song.get.invalidate({ id: song.id });
      }
      utils.song.getAll.invalidate();
      router.push(`/songs/${song?.id ?? ''}`);
    },
  });
  const handleSubmit = async (values: FormValues) => {
    if (newSong) {
      await mutation.mutateAsync(values);
    } else {
      await mutation.mutateAsync({ ...values, id: song.id });
    }
  };

  const removeMutation = trpc.song.remove.useMutation({
    onSuccess: () => {
      if (song) {
        utils.song.get.invalidate({ id: song.id });
      }
      utils.song.getAll.invalidate();
      router.push('/songs');
    },
  });

  return (
    <form style={{ width: '100%' }} onSubmit={form.onSubmit(handleSubmit)}>
      <div className='flex flex-col gap-2'>
        <TextInput
          label='Otsikko'
          placeholder='Otsikko'
          withAsterisk
          spellCheck={false}
          {...form.getInputProps('title')}
        />
        <TextInput
          label='Tekijä'
          placeholder='Tekijä'
          spellCheck={false}
          {...form.getInputProps('author')}
        />
        <TextInput
          label='Melodia'
          placeholder='Melodia'
          spellCheck={false}
          {...form.getInputProps('melody')}
        />
        <Textarea
          label='Sanoitukset'
          placeholder='Sanoitukset'
          withAsterisk
          autosize
          {...form.getInputProps('lyrics')}
        />
        <div className='flex items-center justify-end gap-4'>
          {song && (
            <Button
              variant='outline'
              compact
              onClick={async () => {
                if (
                  window.confirm('Är du säker på att du vill ta bort sången?')
                ) {
                  await removeMutation.mutateAsync({ id: song.id });
                }
              }}
            >
              POISTA KAPPALE
            </Button>
          )}
          <Button className='bg-red-600' type='submit'>
            {(newSong ? 'Luo' : 'Päivitä') + ' kappale'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SongForm;
