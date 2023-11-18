'use client';

import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { trpc } from 'utils/trpc';
import Button from 'components/input/button';
import FormLoadingOverlay from 'components/form-loading-overlay';
import TextInput from 'components/input/text-input';
import TextArea from 'components/input/text-area';
import useColorScheme from 'hooks/use-color-scheme';
import Switch from 'components/input/switch';
import Select from 'components/input/select';
import { lang } from 'utils/language';

const initialValues = {
  nickName: '',
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  lactoseFree: false,
  otherFoodPrefs: '',
  email: '',
  mainInstrument: '',
};
type FormValues = typeof initialValues;

const AccountPreferences = () => {
  const { data: corps, isLoading: corpsLoading } =
    trpc.corps.getSelf.useQuery();
  const utils = trpc.useUtils();
  const [submitting, setSubmitting] = React.useState(false);

  const { colorScheme, toggleColorScheme } = useColorScheme();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      email: (email) => (email.length > 0 ? null : 'Ange e-postadress'),
    },
  });

  useEffect(() => {
    if (!corps) {
      return;
    }
    const mainInstrument = corps.instruments.find((i) => i.isMainInstrument)
      ?.instrument.name;
    form.setValues({
      nickName: corps.nickName ?? '',
      vegetarian: corps.foodPrefs?.vegetarian ?? false,
      vegan: corps.foodPrefs?.vegan ?? false,
      glutenFree: corps.foodPrefs?.glutenFree ?? false,
      lactoseFree: corps.foodPrefs?.lactoseFree ?? false,
      otherFoodPrefs: corps.foodPrefs?.other ?? '',
      email: corps.user.email || undefined,
      mainInstrument,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corps]);

  const mutation = trpc.corps.updateSelf.useMutation({
    onSuccess: () => {
      utils.corps.getSelf.invalidate();
      setSubmitting(false);
      form.resetDirty();
    },
  });
  const handleSubmit = async (values: FormValues) => {
    setSubmitting(true);
    await mutation.mutateAsync(values);
    form.resetTouched();
  };

  const darkThemeMessage =
    'VARNING!\n\nÄven om detta tema är mer bekvämt för ögonen, så finns risken att det påminner om en viss annan studentorkester.\n\nÄr du säker på att du vill byta?';

  /* April fools */
  const date = new Date();
  const isAprilFools = date.getMonth() === 3 && date.getDate() === 1;
  /* April fools */

  const instrumentOptions = corps?.instruments.map((i) => ({
    value: i.instrument.name,
    label: i.instrument.name,
  }));

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormLoadingOverlay visible={submitting || corpsLoading}>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col space-y-2'>
            <h3>{lang('Allmänt', 'General')}</h3>
            <Switch
              label={
                colorScheme === 'dark'
                  ? lang('AK-tema', 'AK mode')
                  : lang('Mörkt tema', 'Dark mode')
              }
              checked={colorScheme === 'dark'}
              onChange={() => {
                /* April fools */
                if (isAprilFools) {
                  alert('get pranked');
                  window.open(
                    'https://www.youtube.com/watch?v=h-d4PlcAGb4',
                    '_blank',
                  );
                  return;
                }
                /* April fools */
                if (colorScheme !== 'dark') {
                  if (confirm(darkThemeMessage)) {
                    toggleColorScheme();
                  }
                } else {
                  toggleColorScheme();
                }
              }}
            />
          </div>
          <div className='flex w-min flex-col space-y-2'>
            <h3>{lang('Corpsiga uppgifter', 'Corps member info')}</h3>
            <TextInput
              label={lang('Visningsnamn', 'Display name')}
              {...form.getInputProps('nickName')}
            />
            <TextInput
              label={lang('E-post', 'Email')}
              withAsterisk
              {...form.getInputProps('email')}
            />
            {instrumentOptions && instrumentOptions.length > 1 && (
              <Select
                label={lang('Huvudinstrument', 'Main instrument')}
                options={instrumentOptions ?? []}
                {...form.getInputProps('mainInstrument')}
              />
            )}
          </div>
          <div className='flex flex-col space-y-2 pl-2'>
            <h3>{lang('Matpreferenser', 'Food preferences')}</h3>
            <Switch
              label='Vegetarian'
              {...form.getInputProps('vegetarian', { type: 'checkbox' })}
            />
            <Switch
              label='Vegan'
              {...form.getInputProps('vegan', { type: 'checkbox' })}
            />
            <Switch
              label={lang('Glutenintolerant', 'Gluten intolerant')}
              {...form.getInputProps('glutenFree', {
                type: 'checkbox',
              })}
            />
            <Switch
              label={lang('Laktosintolerant', 'Lactose intolerant')}
              {...form.getInputProps('lactoseFree', {
                type: 'checkbox',
              })}
            />
            <TextArea
              label={lang(
                'Övriga matpreferenser...',
                'Other food preferences...',
              )}
              {...form.getInputProps('otherFoodPrefs')}
            />
          </div>
        </div>
      </FormLoadingOverlay>
      <div className='flex justify-end p-2'>
        <Button
          disabled={!form.isTouched() || !form.isValid() || submitting}
          type='submit'
        >
          {lang('Spara', 'Save')}
        </Button>
      </div>
    </form>
  );
};

export default AccountPreferences;
