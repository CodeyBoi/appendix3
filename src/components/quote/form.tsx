'use client';

import { useForm } from '@mantine/form';
import { IconSend } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import { trpc } from '../../utils/trpc';
import SelectCorps from '../select-corps';
import Button from 'components/input/button';
import TextArea from 'components/input/text-area';
import TextInput from 'components/input/text-input';

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
  const utils = trpc.useUtils();

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
            defaultValue={quote?.saidByCorpsId}
            {...form.getInputProps('saidByCorpsId')}
          />
          <TextInput
            label='Var sades detta?'
            {...form.getInputProps('location')}
          />
        </div>
        <TextArea
          rightSection={newQuote && <IconSend />}
          label='Vad sades?'
          withAsterisk
          autoSize
          {...form.getInputProps('quote')}
        />
        {!newQuote && (
          <div className='flex items-center justify-end gap-4'>
            <Button
              className='border-red-600 text-red-600 hover:bg-red-600 hover:text-white'
              color='transparent'
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
            <Button type='submit' color='red'>
              Uppdatera citat
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default QuoteForm;
