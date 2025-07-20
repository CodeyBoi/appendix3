'use client';

import { useEffect, useState } from 'react';
import FormLoadingOverlay from 'components/form-loading-overlay';
import Select from 'components/input/select';
import Button from 'components/input/button';
import TextInput from 'components/input/text-input';
import MultiSelect from './multi-select';
import { Language } from 'hooks/use-language';
import { api } from 'trpc/react';
import { ALL_PERMISSIONS, Permission } from 'utils/permission';
import { Resolver, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Corps as PrismaCorps } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'utils/form';
import { stringToNullableNumber } from 'utils/zod';

const nullableNumber = z.string().transform((val) => val === '' ? null : val).nullable().refine((val) => val === null || !isNaN(Number(val)), 'Ogiltigt nummer 23123').transform((val) => val === null ? null : Number(val)).pipe(z.int("asdaskldajd").nullable());

export const CorpsFormSchema = z.object({
  firstName: z.string().min(1, 'Fyll i förnamn').trim(),
  lastName: z.string().min(1, 'Fyll i efternamn').trim(),
  nickName: z.string().trim(),
  pronouns: z.string().trim(),
  number: nullableNumber,
  bNumber: nullableNumber,
  email: z.string().trim(),
  mainInstrument: z.string().trim(),
  otherInstruments: z.array(z.string().trim()),
  roles: z.array(z.string().trim()),
  language: z.enum(['sv', 'en']).default('sv'),
});

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
  language: 'sv',
};
type FormValues = typeof initialValues;

const isNumber = (value: string) => {
  return /^\d*$/.test(value);
};

type Corps = PrismaCorps & {
  email: string;
  mainInstrument: string;
  otherInstruments: string[];
}

interface AdminCorpsProps {
  corps?: Corps;
  instruments: string[];
}

const CorpsForm = ({ corps, instruments }: AdminCorpsProps) => {
  const router = useRouter();
  const utils = api.useUtils();
  const creatingCorps = !corps;
  const [submitting, setSubmitting] = useState(false);

  const { handleSubmit, register, formState: {errors, isDirty, isSubmitting}, } =
    useForm({ resolver: zodResolver(CorpsFormSchema) });

  const mutation = api.corps.upsert.useMutation({
    onSuccess: async ({ id }) => {
      await utils.corps.get.invalidate({ id });
      await utils.corps.getSelf.invalidate();
      // router.back();
    },
  });

  console.log({errors})

  return (
    <form onSubmit={handleSubmit((values) => {
      console.log(values)
    }, (values) => console.log(values))}>
      <FormLoadingOverlay visible={submitting}>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex gap-4'>
            <TextInput
              withAsterisk
              label='Förnamn'
              defaultValue={corps?.firstName}
              {...register('firstName', { required: 'Fyll i föddsdsdrnamn' })}
            />
            <TextInput
              withAsterisk
              label='Efternamn'
              defaultValue={corps?.lastName}
              {...register('lastName')}
            />
          </div>
          <TextInput label='Smeknamn' defaultValue={corps?.nickName ?? undefined} {...register('nickName')} />
          <TextInput label='Pronomen' defaultValue={corps?.pronouns ?? undefined} {...register('pronouns')} />
          <div className='flex gap-4'>
            <TextInput
              label='Nummer'
              defaultValue={corps?.number?.toString() ?? undefined}
              {...register('number')}
            />
            <TextInput
              label='Balettnr.'
              defaultValue={corps?.bNumber?.toString() ?? undefined}
              {...register('bNumber')}
            />
          </div>
          <span className='self-end'>
            <TextInput withAsterisk label='Email' defaultValue={corps?.email} {...register('email')} />
          </span>
          <Select
            label='Huvudinstrument'
            placeholder='Välj instrument...'
            options={
              instruments?.map((instr) => ({ value: instr, label: instr })) ?? []
            }
            withAsterisk
            defaultValue={corps?.mainInstrument}
            {...register('mainInstrument', { required: 'Välj huvudinstrument' })}
          />
          <MultiSelect
            placeholder='Övriga instrument...'
            options={
              instruments?.map((instr) => ({ value: instr, label: instr})) ?? []
            }
            defaultValue={corps?.otherInstruments}
            {...register('otherInstruments')}
          />
          <Select
            label='Språk'
            options={[
              { value: 'sv', label: 'Svenska' },
              { value: 'en', label: 'English' },
            ]}
            withAsterisk
            {...register('language')}
          />
        </div>
      </FormLoadingOverlay>
      <div className='flex justify-end p-2'>
        <Button
          className='bg-red-600'
          disabled={!isDirty || isSubmitting}
          type='submit'
        >
          {creatingCorps ? 'Skapa corpsmedlem' : 'Spara ändringar'}
        </Button>
      </div>
    </form>
  );
};

export default CorpsForm;
