import {
  Button,
  Group,
  Stack,
  Switch,
  TextInput,
  Title,
  useMantineColorScheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import React, { useEffect } from 'react';
import useColorScheme from '../../hooks/use-color-scheme';
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

  return (
    <Stack>
      <Title order={3}>Inställningar</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing='md'>
          <FormLoadingOverlay visible={submitting || corpsLoading}>
            <Stack spacing='xs'>
              <Title order={6}>Allmänt</Title>
              <Switch
                pl='xs'
                mb='md'
                label={colorScheme === 'dark' ? 'AK-tema' : 'Mörkt tema'}
                checked={colorScheme === 'dark'}
                onChange={() => {
                  if (colorScheme !== 'dark') {
                    if (confirm(darkThemeMessage)) {
                      toggleColorScheme();
                    }
                  } else {
                    toggleColorScheme();
                  }
                }}
              />
              <Title order={6}> Kontaktuppgifter</Title>
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
            </Stack>
            <br />
            <Stack spacing='xs'>
              <Title order={6}>Matpreferenser</Title>
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
            </Stack>
          </FormLoadingOverlay>
          <Group position='right'>
            <Button
              disabled={!form.isTouched() || !form.isValid() || submitting}
              loading={submitting}
              type='submit'
            >
              Spara
            </Button>
          </Group>
        </Stack>
      </form>
    </Stack>
  );
};

export default AccountPreferences;
