'use client';

import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import FormLoadingOverlay from 'components/form-loading-overlay';
import Select from 'components/input/select';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import MultiSelect from './multi-select';
import { Language } from 'hooks/use-language';
import { api } from 'trpc/react';
import { Permission } from 'utils/permission';

const initialValues = {
  firstName: '',
  lastName: '',
  nickName: '',
  pronouns: '',
  number: '',
  bNumber: '',
  email: '',
  mainInstrument: '',
  otherInstruments: [] as string[],
  roles: [] as Permission[],
  language: 'sv',
};
type FormValues = typeof initialValues;

const isNumber = (value: string) => {
  return /^\d*$/.test(value);
};

interface AdminCorpsProps {
  corpsId: string;
}

const CorpsForm = ({ corpsId }: AdminCorpsProps) => {
  const utils = api.useUtils();
  const creatingCorps = corpsId === 'new';
  const [loading, setLoading] = useState(!creatingCorps);
  const [submitting, setSubmitting] = useState(false);

  const { data: instruments } = api.instrument.getAll.useQuery();
  const { data: corps, isLoading: corpsLoading } = api.corps.get.useQuery({
    id: corpsId,
  });
  const { data: roles } = api.permission.getRoles.useQuery();

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
        pronouns: corps.pronouns ?? '',
        number: corps.number?.toString() || '',
        bNumber: corps.bNumber?.toString() || '',
        email: corps.user.email ?? '',
        mainInstrument,
        otherInstruments,
        roles: corps.roles.map((r) => r.name as Permission),
        language: corps.language,
      });
      setLoading(false);
    } else if (creatingCorps) {
      form.reset();
      setLoading(false);
    }
  }, [corps]);

  const mutation = api.corps.upsert.useMutation({
    onSuccess: async () => {
      await utils.corps.get.invalidate({ id: corpsId });
      await utils.corps.getSelf.invalidate();
      setSubmitting(false);
      form.resetDirty();
      form.resetTouched();
    },
  });

  const handleSubmit = (values: FormValues) => {
    setSubmitting(true);
    const number = values.number.trim() ? parseInt(values.number.trim()) : null;
    const bNumber = values.bNumber.trim()
      ? parseInt(values.bNumber.trim())
      : null;
    mutation.mutate({
      ...values,
      number,
      bNumber,
      id: creatingCorps ? undefined : corpsId,
      language: values.language as Language,
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormLoadingOverlay visible={loading || submitting || corpsLoading}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex gap-4'>
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
          </div>
          <TextInput label='Smeknamn' {...form.getInputProps('nickName')} />
          <TextInput label='Pronomen' {...form.getInputProps('pronouns')} />
          <div className='flex gap-4'>
            <TextInput label='Nummer' {...form.getInputProps('number')} />
            <TextInput label='Balettnr.' {...form.getInputProps('bNumber')} />
          </div>
          <span className='self-end'>
            <TextInput
              withAsterisk
              label='Email'
              {...form.getInputProps('email')}
            />
          </span>
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
            options={
              instruments?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            {...form.getInputProps('otherInstruments')}
          />
          <MultiSelect
            label='Behörighetsroller'
            placeholder='Välj behörighet...'
            options={
              roles?.map((i) => ({ value: i.name, label: i.name })) ?? []
            }
            {...form.getInputProps('roles')}
          />
          <Select
            label='Språk'
            options={[
              { value: 'sv', label: 'Svenska' },
              { value: 'en', label: 'English' },
            ]}
            withAsterisk
            {...form.getInputProps('language')}
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
