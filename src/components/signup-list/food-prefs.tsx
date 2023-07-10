import { CorpsFoodPrefs } from '@prisma/client';
import React from 'react';
import { trpc } from '../../utils/trpc';
import { Button, Space, Table, createStyles } from '@mantine/core';
import { IconDownload } from '@tabler/icons';

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
  const { data: gig } = trpc.gig.getWithId.useQuery({ gigId });
  const { data: signups } = trpc.gig.getSignups.useQuery({ gigId });
  const { classes } = useStyles();
  const yesSignups = signups?.filter((signup) => signup.signupStatus === 'Ja');

  const dataRows = yesSignups?.map((signup) => {
    const corpsPrefs = foodPrefs[signup.corpsId] as CorpsFoodPrefs;
    const prefs = corpsPrefs ? corpsPrefs : DEFAULT_FOOD_PREFS;

    return {
      corpsId: signup.corpsId,
      data: [
        `${signup.number ? '#' + signup.number.toString() : 'p.e.'} ${
          signup.firstName
        } ${signup.lastName}`,
        prefs.vegetarian ? 'X' : '',
        prefs.vegan ? 'X' : '',
        prefs.glutenFree ? 'X' : '',
        prefs.lactoseFree ? 'X' : '',
        prefs.drinksAlcohol ? 'X' : '',
        prefs.other,
      ],
    };
  });

  const csvDownloadLink = dataRows
    ? `data:text/csv;charset=utf-8,Namn,Vegetarian,Vegan,Gluten,Laktos,Alkohol,Övrigt\n${encodeURIComponent(
        dataRows
          ?.map((row) =>
            row.data
              // Wrap text in quotes, otherwise it will be split into multiple columns if it contains commas
              .map((text) => `"${text}"`)
              .join(','),
          )
          .join('\n') ?? '',
      )}`
    : '';

  const rows = dataRows?.map((row) => {
    return (
      <tr key={row.corpsId}>
        <td>{row.data[0]}</td>
        <td>{row.data[1]}</td>
        <td>{row.data[2]}</td>
        <td>{row.data[3]}</td>
        <td>{row.data[4]}</td>
        <td>{row.data[5]}</td>
        <td>{row.data[6]}</td>
      </tr>
    );
  });

  return (
    <>
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
      {dataRows && (
        <>
          <Space h='md' />
          <Button
            leftIcon={<IconDownload />}
            component={'a'}
            href={csvDownloadLink}
            download={`Matpreffar ${gig?.title.trim() ?? ''}.csv`}
          >
            Ladda ner som CSV
          </Button>
        </>
      )}
    </>
  );
};

export default FoodPrefs;
