'use client';

import { useForm } from '@mantine/form';
import Button from 'components/input/button';
import NumberInput from 'components/input/number-input';
import TextArea from 'components/input/text-area';
import { useRouter } from 'next/navigation';
import { api } from 'trpc/react';

const initialValues = {
  endsIn: 60,
  options: '',
};
type FormValues = typeof initialValues;

const AdminVotationForm = () => {
  const router = useRouter();
  const utils = api.useUtils();

  const formHook = useForm<FormValues>({
    initialValues,
  });

  const mutation = api.votation.create.useMutation({
    onSuccess: () => {
      router.replace('/');
      utils.votation.getCurrent.invalidate();
      router.refresh();
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const endsAt = new Date(new Date().getTime() + values.endsIn * 1000);
    const options = values.options.split('\n').map((s) => s.trim());
    await mutation.mutateAsync({ endsAt, options });
  };

  return (
    <form onSubmit={formHook.onSubmit(handleSubmit)}>
      <div className='flex flex-col gap-2'>
        <TextArea
          label='Alternativ'
          {...formHook.getInputProps('options')}
          withAsterisk
        />
        <div className='flex items-baseline gap-2'>
          <span className='grow'>
            <NumberInput
              label='Varaktighet (sek)'
              {...formHook.getInputProps('endsIn')}
            />
          </span>
          <Button type='submit'>Öppna röstning!</Button>
        </div>
      </div>
    </form>
  );
};

export default AdminVotationForm;
