import Link from 'next/link';
import Button from 'components/input/button';
import CorpsForm from 'components/corps-form';
import { api } from 'trpc/server';
import { lang } from 'utils/language';
import ParamsSelectCorps from 'components/params-select-corps';

const getCorps = async (id: string) => {
  const corps = await api.corps.get.query({ id });
  if (!corps) {
    return null;
  }

  const mainInstrument = corps.instruments.find((instr) => instr.isMainInstrument);
  if (!mainInstrument) {
    throw new Error('A main instrument should always be defined');
  }
  
  return {
    ...corps,
    email: corps.user.email,
    mainInstrument: mainInstrument.instrument.name,
    otherInstruments: corps.instruments.flatMap((instr) => instr.isMainInstrument ? []: [instr.instrument.name]),
  }
}

const ViewCorps = async ({
  searchParams,
}: { searchParams: { id?: string, }}) => {
  const id = searchParams.id;
  const corps = id ? await getCorps(id) : undefined;
  const instruments = (await api.instrument.getAll.query()).map((instr) => instr.name);

  return (
    <div className='flex max-w-lg flex-col gap-2'>
        {!id && (
          <>
          <h1>Corps</h1>
          <div className='max-w-max'>
            <Link href='/admin/corps/new'>
              <Button>Skapa corps</Button>
            </Link>
          </div>
          <div className='h-2' />
          <h2>Uppdatera corps</h2>
          <ParamsSelectCorps />
          </>
        )}
      {id && corps === null && (
        <div>{lang(`Kunde inte hitta corps med id: ${id}`, `Couldn't find corps with id: ${id}`)}</div>
      )}
      {id && corps !== null && (
        <>
          <h2>Uppdatera corps</h2>
        <div className='rounded border p-2 shadow-md dark:border-neutral-800'>
          <CorpsForm corps={corps} instruments={instruments} />
        </div>
      </>
      )}
    </div>
  );
};

export default ViewCorps;
