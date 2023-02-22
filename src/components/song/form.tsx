import { Stack, TextInput, Group, Button, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/router';
import React from 'react';
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
      router.push('/songs');
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
      router.push('/songs');
    },
  });

  return (
    <form style={{ width: '100%' }} onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
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
        <Textarea
          label='Text'
          placeholder='Text'
          autosize
          {...form.getInputProps('lyrics')}
        />
        <Group position='right'>
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
              RADERA SÅNG
            </Button>
          )}
          <Button type='submit'>
            {(newSong ? 'Skapa' : 'Uppdatera') + ' sång'}
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default SongForm;
