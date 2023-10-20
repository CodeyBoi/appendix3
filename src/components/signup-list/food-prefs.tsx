import { CorpsFoodPrefs } from '@prisma/client';
import { IconDownload } from '@tabler/icons';
import Button from 'components/button';

type Signup = {
  status: {
    value: string;
  };
  checkbox1: boolean;
  checkbox2: boolean;
  corps: {
    number: number | null;
    id: string;
    fullName: string;
    displayName: string;
  };
};

type FoodPrefsProps = {
  gigTitle: string;
  signups: Signup[];
  foodPrefs: Record<string, CorpsFoodPrefs>;
  checkbox1?: string;
  checkbox2?: string;
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

const FoodPrefs = ({
  signups,
  foodPrefs,
  gigTitle,
  checkbox1,
  checkbox2,
}: FoodPrefsProps) => {
  const yesSignups = signups.filter((signup) => signup.status.value === 'Ja');

  const dataRows = yesSignups.map((signup) => {
    const prefs = foodPrefs[signup.corps.id] ?? DEFAULT_FOOD_PREFS;
    return {
      corpsId: signup.corps.id,
      data: [
        `${
          signup.corps.number ? '#' + signup.corps.number.toString() : 'p.e.'
        } ${signup.corps.fullName}`,
        signup.checkbox1 ? 'X' : '',
        signup.checkbox2 ? 'X' : '',
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
      <tr key={row.corpsId} className='divide-x divide-solid'>
        <td className='pr-2 text-right' style={{ whiteSpace: 'nowrap' }}>
          {row.data[0]}
        </td>
        {checkbox1 !== undefined && (
          <td className='text-center'>{row.data[1]}</td>
        )}
        {checkbox2 !== undefined && (
          <td className='text-center'>{row.data[2]}</td>
        )}
        <td className='text-center'>{row.data[3]}</td>
        <td className='text-center'>{row.data[4]}</td>
        <td className='text-center'>{row.data[5]}</td>
        <td className='text-center'>{row.data[6]}</td>
        <td className='text-center'>{row.data[7]}</td>
        <td className='pl-2'>{row.data[8]}</td>
      </tr>
    );
  });

  return (
    <>
      <table className='table'>
        <thead>
          <tr>
            <th className='px-1 text-right'>Namn</th>
            {checkbox1 !== undefined && <th className='px-1'>{checkbox1}</th>}
            {checkbox2 !== undefined && <th className='px-1'>{checkbox2}</th>}
            <th className='px-1'>Vegetarian</th>
            <th className='px-1'>Vegan</th>
            <th className='px-1'>Gluten</th>
            <th className='px-1'>Laktos</th>
            <th className='px-1'>Alkohol (gammal)</th>
            <th className='px-1'>Övrigt</th>
          </tr>
        </thead>
        <tbody className='gap-1 divide-y divide-solid'>{rows}</tbody>
      </table>
      {dataRows && (
        <>
          <div className='h-4' />
          <a
            href={csvDownloadLink}
            download={`Matpreffar ${gigTitle.trim() ?? ''}.csv`}
          >
            <Button className='bg-red-600' leftSection={<IconDownload />}>
              Ladda ner som CSV
            </Button>
          </a>
        </>
      )}
    </>
  );
};

export default FoodPrefs;
