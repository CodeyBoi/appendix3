'use client';

import { MultiSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { trpc } from 'utils/trpc';
import FormLoadingOverlay from 'components/form-loading-overlay';
import Select from 'components/input/select';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';

const initialValues = {
  firstName: '',
  lastName: '',
  nickName: '',
  number: '',
  bNumber: '',
  email: '',
  mainInstrument: '',
  otherInstruments: [] as string[],
  role: 'user',
};
type FormValues = typeof initialValues;

const isNumber = (value: string) => {
  return /^\d*$/.test(value);
};

interface AdminCorpsProps {
  corpsId: string;
}

const CorpsForm = ({ corpsId }: AdminCorpsProps) => {
  const utils = trpc.useContext();
  const creatingCorps = corpsId === 'new';
  const [loading, setLoading] = useState(!creatingCorps);
  const [submitting, setSubmitting] = useState(false);

  const { data: instruments } = trpc.instrument.getAll.useQuery();
  const { data: corps, isLoading: corpsLoading } = trpc.corps.get.useQuery({
    id: corpsId,
  });
  const { data: roles } = trpc.role.getAll.useQuery();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      firstName: (value) => (value.length > 0 ? null : 'Fyll i förnamn'),
      lastName: (value) => (value.length > 0 ? null : 'Fyll i efternamn'),
      number: (value) => (isNumber(value) ? null : 'Ogitligt nummer'),
      bNumber: (value) => (isNumber(value) ? null : 'Ogitligt balettnummer'),
      email: (value) =>
        /^\S+@\S+$/.test(value) ? null : 'Ogiltig emailadress',
      mainInstrument: (value) => (value ? null : 'Välj ett huvudinstrument'),
      otherInstruments: (value, values) =>
        value.includes(values.mainInstrument)
          ? 'Huvudinstrument kan inte väljas som övrigt instrument'
          : null,
    },
  });

  useEffect(() => {
    if (corps) {
      const mainInstrument = corps.instruments.find((i) => i.isMainInstrument)
        ?.instrument.name;
      const otherInstruments = corps.instruments
        .filter((i) => !i.isMainInstrument)
        .map((i) => i.instrument.name);
      form.setValues({
        firstName: corps.firstName,
        lastName: corps.lastName,
        nickName: corps.nickName ?? '',
        number: corps.number?.toString() || '',
        bNumber: corps.bNumber?.toString() || '',
        email: corps.user.email ?? '',
        mainInstrument,
        otherInstruments,
        role: corps.role?.name ?? 'user',
      });
      setLoading(false);
    } else if (creatingCorps) {
      form.reset();
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corps]);

  const mutation = trpc.corps.upsert.useMutation({
    onSuccess: () => {
      utils.corps.get.invalidate({ id: corpsId });
      utils.corps.getSelf.invalidate();
      setSubmitting(false);
      form.resetDirty();
      form.resetTouched();
      // router.push("/admin/corps");
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    const number = values.number.trim() ? parseInt(values.number.trim()) : null;
    const bNumber = values.bNumber.trim()
      ? parseInt(values.bNumber.trim())
      : null;
    await mutation.mutateAsync({
      ...values,
      number,
      bNumber,
      id: creatingCorps ? undefined : corpsId,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormLoadingOverlay visible={loading || submitting || corpsLoading}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <TextInput
            withAsterisk
            label='Förnamn'
            {...form.getInputProps('firstName')}
          />
          <TextInput
            withAsterisk
            label='Efternamn'
            {...form.getInputProps('lastName')}
          />
          <TextInput label='Smeknamn' {...form.getInputProps('nickName')} />
          <div className='flex gap-4'>
            <TextInput label='Nummer' {...form.getInputProps('number')} />
            <TextInput label='Balettnr.' {...form.getInputProps('bNumber')} />
          </div>
          <Select
            label='Huvudinstrument'
            placeholder='Välj instrument...'
            options={
              instruments?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            withAsterisk
            {...form.getInputProps('mainInstrument')}
          />
          <MultiSelect
            label='Övriga instrument'
            placeholder='Välj instrument...'
            clearable
            data={
              instruments?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            {...form.getInputProps('otherInstruments')}
          />
          <TextInput
            withAsterisk
            label='Email'
            {...form.getInputProps('email')}
          />
          <Select
            label='Behörighetsroll'
            placeholder='Välj behörighet...'
            options={
              roles?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            withAsterisk
            {...form.getInputProps('role')}
          />
        </div>
      </FormLoadingOverlay>
      <div className='flex justify-end p-2'>
        <Button
          className='bg-red-600'
          disabled={!form.isTouched() || submitting || !form.isValid()}
          type='submit'
        >
          {creatingCorps ? 'Skapa corpsmedlem' : 'Spara ändringar'}
        </Button>
      </div>
    </form>
  );
};

export default CorpsForm;
