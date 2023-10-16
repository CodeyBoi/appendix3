import {
  Button,
  Switch,
  TextInput,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import { trpc } from '../../utils/trpc';
import FormLoadingOverlay from '../form-loading-overlay';

const initialValues = {
  firstName: '',
  lastName: '',
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  lactoseFree: false,
  drinksAlcohol: false,
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
      vegetarian: corps.foodPrefs?.vegetarian ?? false,
      vegan: corps.foodPrefs?.vegan ?? false,
      glutenFree: corps.foodPrefs?.glutenFree ?? false,
      lactoseFree: corps.foodPrefs?.lactoseFree ?? false,
      drinksAlcohol: corps.foodPrefs?.drinksAlcohol ?? false,
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
    <div className='flex flex-col gap-2'>
      <h3>Inställningar</h3>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <div className='flex flex-col gap-2'>
          <FormLoadingOverlay visible={submitting || corpsLoading}>
            <div className='flex flex-col'>
              <h6>Allmänt</h6>
              <Switch
                pl='xs'
                mb='md'
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
              <h6> Kontaktuppgifter</h6>
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
                label='E-post'
                placeholder='E-post'
                withAsterisk
                {...form.getInputProps('email')}
              />
            </div>
            <br />
            <div className='flex flex-col space-y-2'>
              <h6>Matpreferenser</h6>
              <Switch
                pl='xs'
                label='Dricker alkohol'
                {...form.getInputProps('drinksAlcohol', { type: 'checkbox' })}
              />
              <Switch
                pl='xs'
                label='Vegetarian'
                {...form.getInputProps('vegetarian', { type: 'checkbox' })}
              />
              <Switch
                pl='xs'
                label='Vegan'
                {...form.getInputProps('vegan', { type: 'checkbox' })}
              />
              <Switch
                pl='xs'
                label='Glutenfritt'
                {...form.getInputProps('glutenFree', {
                  type: 'checkbox',
                })}
              />
              <Switch
                pl='xs'
                label='Laktosfritt'
                {...form.getInputProps('lactoseFree', {
                  type: 'checkbox',
                })}
              />
              <TextInput
                label='Övriga matpreferenser'
                placeholder='Övriga matpreferenser...'
                {...form.getInputProps('otherFoodPrefs')}
              />
            </div>
          </FormLoadingOverlay>
          <div className='flex justify-end p-2'>
            <Button
              className='bg-red-600'
              disabled={!form.isTouched() || !form.isValid() || submitting}
              loading={submitting}
              type='submit'
            >
              Spara
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AccountPreferences;
