import { Switch, useMantineColorScheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import Button from '../input/button';
import FormLoadingOverlay from '../form-loading-overlay';
import TextInput from 'components/input/text-input';

const initialValues = {
  firstName: '',
  lastName: '',
  nickName: '',
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  lactoseFree: false,
  otherFoodPrefs: '',
  email: '',
};
type FormValues = typeof initialValues;

const AccountPreferences = () => {
  const { data: corps, isLoading: corpsLoading } =
    trpc.corps.getSelf.useQuery();
  const utils = trpc.useContext();
  const [submitting, setSubmitting] = React.useState(false);

  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const form = useForm<FormValues>({
    initialValues,
    validate: {
      firstName: (firstName) => (firstName.length > 0 ? null : 'Ange förnamn'),
      lastName: (lastName) => (lastName.length > 0 ? null : 'Ange efternamn'),
      email: (email) => (email.length > 0 ? null : 'Ange e-postadress'),
    },
  });

  useEffect(() => {
    if (!corps) {
      return;
    }
    form.setValues({
      firstName: corps.firstName,
      lastName: corps.lastName,
      nickName: corps.nickName ?? '',
      vegetarian: corps.foodPrefs?.vegetarian ?? false,
      vegan: corps.foodPrefs?.vegan ?? false,
      glutenFree: corps.foodPrefs?.glutenFree ?? false,
      lactoseFree: corps.foodPrefs?.lactoseFree ?? false,
      otherFoodPrefs: corps.foodPrefs?.other ?? '',
      email: corps.user.email || undefined,
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

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <FormLoadingOverlay visible={submitting || corpsLoading}>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-col space-y-2'>
            <h3>Allmänt</h3>
            <Switch
              pl='xs'
              label={colorScheme === 'dark' ? 'AK-tema' : 'Mörkt tema'}
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
          <div className='flex flex-col space-y-2'>
            <h3>Kontaktuppgifter</h3>
            <TextInput
              label='Förnamn'
              placeholder='Förnamn'
              withAsterisk
              {...form.getInputProps('firstName')}
            />
            <TextInput
              label='Efternamn'
              placeholder='Efternamn'
              withAsterisk
              {...form.getInputProps('lastName')}
            />
            <TextInput
              label='Smeknamn'
              placeholder='Smeknamn'
              {...form.getInputProps('nickName')}
            />
            <TextInput
              label='E-post'
              placeholder='E-post'
              withAsterisk
              {...form.getInputProps('email')}
            />
          </div>
          <div className='flex flex-col pl-2 space-y-2'>
            <h3>Matpreferenser</h3>
            <Switch
              label='Vegetarian'
              {...form.getInputProps('vegetarian', { type: 'checkbox' })}
            />
            <Switch
              label='Vegan'
              {...form.getInputProps('vegan', { type: 'checkbox' })}
            />
            <Switch
              label='Glutenfritt'
              {...form.getInputProps('glutenFree', {
                type: 'checkbox',
              })}
            />
            <Switch
              label='Laktosfritt'
              {...form.getInputProps('lactoseFree', {
                type: 'checkbox',
              })}
            />
            <TextInput
              placeholder='Övriga matpreferenser...'
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
          Spara
        </Button>
      </div>
    </form>
  );
};

export default AccountPreferences;
