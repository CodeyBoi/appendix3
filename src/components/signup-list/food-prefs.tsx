import { CorpsFoodPrefs } from '@prisma/client';
import React from 'react';
import { trpc } from '../../utils/trpc';
import { Table, createStyles } from '@mantine/core';

type FoodPrefsProps = {
  gigId: string;
  foodPrefs: Record<string, CorpsFoodPrefs>;
};

const DEFAULT_FOOD_PREFS: CorpsFoodPrefs = {
  corpsId: '',
  vegetarian: false,
  vegan: false,
  glutenFree: false,
  lactoseFree: false,
  drinksAlcohol: false,
  other: '',
};

const useStyles = createStyles(() => ({
  table: {
    textAlign: 'center',
  },
}));

const FoodPrefs = ({ gigId, foodPrefs }: FoodPrefsProps) => {
  const { data: signups } = trpc.gig.getSignups.useQuery({ gigId });
  const { classes } = useStyles();

  console.log({ foodPrefs });

  const rows = signups?.map((signup) => {
    const corpsPrefs = foodPrefs[signup.corpsId] as CorpsFoodPrefs;
    const prefs = corpsPrefs ? corpsPrefs : DEFAULT_FOOD_PREFS;

    return (
      <tr key={signup.corpsId}>
        <td>{`${signup.number ? '#' + signup.number.toString() : 'p.e.'} ${
          signup.firstName
        } ${signup.lastName}`}</td>
        <td>{prefs.vegetarian ? 'X' : ''}</td>
        <td>{prefs.vegan ? 'X' : ''}</td>
        <td>{prefs.glutenFree ? 'X' : ''}</td>
        <td>{prefs.lactoseFree ? 'X' : ''}</td>
        <td>{prefs.drinksAlcohol ? 'X' : ''}</td>
        <td>{prefs.other}</td>
      </tr>
    );
  });

  return (
    <Table
      withColumnBorders
      horizontalSpacing={2}
      verticalSpacing={2}
      className={classes.table}
    >
      <thead>
        <tr>
          <th>Namn</th>
          <th>Vegetarian</th>
          <th>Vegan</th>
          <th>Gluten</th>
          <th>Laktos</th>
          <th>Alkohol</th>
          <th>Övrigt</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  );
};

export default FoodPrefs;
