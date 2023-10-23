import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import Button from 'components/input/button';
import TextArea from 'components/input/text-area';
import TextInput from 'components/input/text-input';

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
          label='Titel'
          placeholder='Titel'
          withAsterisk
          spellCheck={false}
          {...form.getInputProps('title')}
        />
        <TextInput
          label='Författare'
          placeholder='Författare'
          spellCheck={false}
          {...form.getInputProps('author')}
        />
        <TextInput
          label='Melodi'
          placeholder='Melodi'
          spellCheck={false}
          {...form.getInputProps('melody')}
        />
        <TextArea
          label='Sångtext'
          placeholder='Sångtext'
          withAsterisk
          autoSize
          {...form.getInputProps('lyrics')}
        />
        <div className='flex items-center justify-end gap-4'>
          {song && (
            <Button
              className='text-red-600 border-red-600 hover:bg-red-600 hover:text-white'
              color='transparent'
              compact
              onClick={async () => {
                if (
                  window.confirm('Är du säker på att du vill ta bort sången?')
                ) {
                  await removeMutation.mutateAsync({ id: song.id });
                }
              }}
            >
              RADERA SÅNG
            </Button>
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
