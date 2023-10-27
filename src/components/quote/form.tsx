import { Button, TextInput, Textarea } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import SelectCorps from '../select-corps';

const defaultValues = {
  quote: '',
  location: '',
  saidByCorpsId: '',
};
type FormValues = typeof defaultValues;
type QuoteFormProps = {
  quote?: FormValues & { id: string };
};

const QuoteForm = ({ quote }: QuoteFormProps) => {
  const router = useRouter();
  const utils = trpc.useContext();

  const newQuote = !quote;

  const form = useForm<FormValues>({
    initialValues: newQuote
      ? defaultValues
      : {
          quote: quote.quote,
          location: quote.location,
          saidByCorpsId: quote.saidByCorpsId,
        },
    validate: {
      quote: (quote) => (quote ? null : 'Fyll i citat'),
      saidByCorpsId: (saidByCorpsId) => (saidByCorpsId ? null : 'Välj corps'),
    },
  });

  const mutation = trpc.quote.upsert.useMutation({
    onSuccess: () => {
      utils.quote.infiniteScroll.invalidate();
    },
  });
  const handleSubmit = async (values: FormValues) => {
    if (newQuote) {
      await mutation.mutateAsync(values);
      form.reset();
    } else {
      await mutation.mutateAsync({ ...values, id: quote.id });
      router.push('/quotes');
    }
  };

  const removeMutation = trpc.quote.remove.useMutation({
    onSuccess: () => {
      utils.quote.infiniteScroll.invalidate();
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <div className='flex flex-col gap-2'>
        <div className='flex gap-4'>
          <SelectCorps
            label='Vem sade detta?'
            placeholder='Välj corps...'
            withAsterisk
            defaultValue={quote?.saidByCorpsId}
            {...form.getInputProps('saidByCorpsId')}
          />
          <TextInput
            label='Var sades detta?'
            placeholder='Plats'
            {...form.getInputProps('location')}
          />
        </div>
        <Textarea
          rightSection={newQuote && <IconSend />}
          label='Vad sades?'
          placeholder='Citat'
          withAsterisk
          autosize
          {...form.getInputProps('quote')}
        />
        {!newQuote && (
          <div className='flex items-center justify-end gap-4'>
            <Button
              variant='outline'
              compact
              onClick={async () => {
                if (
                  window.confirm('Är du säker på att du vill ta bort citatet?')
                ) {
                  await removeMutation.mutateAsync({ id: quote.id });
                  router.push('/quotes');
                }
              }}
            >
              RADERA CITAT
            </Button>
            <Button type='submit' className='bg-red-600'>
              Uppdatera citat
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default QuoteForm;
