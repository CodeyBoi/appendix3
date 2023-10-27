'use client';

import { useForm } from '@mantine/form';
import { IconUser } from '@tabler/icons';
import { useQueryClient } from '@tanstack/react-query';
import React, { useMemo, useState } from 'react';
import { trpc } from 'utils/trpc';
import Button from 'components/input/button';
import Loading from 'components/loading';
import MultiSelectCorps from 'components/multi-select-corps-fetch';
import Entry from './entry';
import Switch from 'components/input/switch';

interface SignupListProps {
  gigId: string;
}

const FULL_SETTING: [string, number][] = [
  ['Dirigent', 1],
  ['Piccolo', 0],
  ['Flöjt', 2],
  ['Oboe', 0],
  ['Klarinett', 3],
  ['Fagott', 0],
  ['Basklarinett', 0],
  ['Sopransax', 0],
  ['Altsax', 2],
  ['Tenorsax', 1],
  ['Barytonsax', 1],
  ['Horn', 2],
  ['Trumpet', 3],
  ['Trombon', 3],
  ['Eufonium', 1],
  ['Tuba', 1],
  ['Slagverk', 3],
  ['Balett', 4],
  ['Annat', 0],
];

const toPlural = (instrument: string) => {
  instrument = instrument.trim().toLowerCase();
  if (instrument === 'piccola') {
    return 'piccolor';
  } else if (instrument === 'oboe') {
    return 'oboer';
  } else if (instrument === 'sopransax') {
    return 'sopransaxar';
  } else if (instrument === 'altsax') {
    return 'altsaxar';
  } else if (instrument === 'tenorsax') {
    return 'tenorsaxar';
  } else if (instrument === 'barytonsax') {
    return 'barytonsaxar';
  } else if (instrument === 'horn') {
    return 'horn';
  } else if (instrument === 'eufonium') {
    return 'eufonier';
  } else if (instrument === 'tuba') {
    return 'tubor';
  } else if (instrument === 'slagverk') {
    return 'slagverkare';
  }
  return instrument + 'er';
};

const SignupList = ({ gigId }: SignupListProps) => {
  const queryClient = useQueryClient();
  const utils = trpc.useUtils();

  const { data: gig } = trpc.gig.getWithId.useQuery({ gigId });

  const gigHasHappened = gig
    ? gig.date.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24
    : false;

  const { data: signups, isInitialLoading: signupsLoading } =
    trpc.gig.getSignups.useQuery({ gigId });

  const { data: role } = trpc.corps.getRole.useQuery();
  const isAdmin = role === 'admin';

  const [editMode, setEditMode] = useState(false);

  const showAdminTools = isAdmin && editMode;

  const { data: instruments } = trpc.instrument.getAll.useQuery();
  // An object which maps instrument names to their position in the INSTRUMENTS array
  const instrumentPrecedence: { [key: string]: number } = useMemo(
    () =>
      instruments?.reduce((acc, instrument) => {
        (acc as { [key: string]: number })[instrument.name] = instrument.id;
        return acc;
      }, {}) ?? [],
    [instruments],
  );
  // Hack to make sure the conductor is always first
  instrumentPrecedence['Dirigent'] = -1;

  // Sorts the list of corpsii by instrument precedence, then number, then last name, then first name.
  const signupsSorted = useMemo(
    () =>
      signups
        ?.filter(
          (signup) => !gigHasHappened || showAdminTools || signup.attended,
        )
        .sort((a, b) => {
          // Compare instrument precedence
          if (a.instrument !== b.instrument) {
            const aPrio = instrumentPrecedence[a.instrument.name] ?? Infinity;
            const bPrio = instrumentPrecedence[b.instrument.name] ?? Infinity;
            return aPrio - bPrio;
          }

          // Compare numbers
          if (a.corps.number || b.corps.number) {
            return (a.corps.number || Infinity) - (b.corps.number || Infinity);
          }

          // Compare last name
          if (a.corps.lastName !== b.corps.lastName) {
            return a.corps.lastName.localeCompare(b.corps.lastName);
          }

          // Compare first name
          return a.corps.firstName.localeCompare(b.corps.firstName);
        }) ?? [],
    [signups, instrumentPrecedence, gigHasHappened, showAdminTools],
  );

  // Divide the list of corpsii into people who answered yes and people who answered maybe
  const splitList = signupsSorted?.reduce(
    (acc, signup) => {
      if (signup.status.value === 'Ja') {
        acc.yesList.push(signup);
      } else if (signup.status.value === 'Kanske') {
        acc.maybeList.push(signup);
      } else if (signup.status.value === 'Nej') {
        acc.noList.push(signup);
      }
      return acc;
    },
    {
      yesList: [] as typeof signupsSorted,
      maybeList: [] as typeof signupsSorted,
      noList: [] as typeof signupsSorted,
    },
  );

  const yesList = splitList?.yesList;
  const maybeList = splitList?.maybeList;
  const noList = splitList?.noList;

  const form = useForm({
    initialValues: { corpsIds: [] as string[] },
    validate: {
      corpsIds: (value) =>
        value.length > 0 ? null : 'Du måste välja minst ett corps',
    },
  });

  const addSignups = trpc.gig.addSignups.useMutation({
    onMutate: async () => {
      form.reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries([['gig', 'getSignups'], { gigId }]);
    },
  });

  const editAttendance = trpc.gig.editAttendance.useMutation();

  const removeSignup = trpc.gig.removeSignup.useMutation({
    onSuccess: async ({ corpsId, gigId }) => {
      await utils.gig.getSignup.invalidate({ corpsId, gigId });
      await utils.gig.getSignups.invalidate({ gigId });
    },
  });

  const handleDelete = (corpsId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort anmälningen?')) {
      removeSignup.mutateAsync({ corpsId, gigId });
    }
  };

  /** Code from here on is absolutely horrible, but it works.
   *  Travelers beware.
   */

  const signupsToTable = (signups: typeof signupsSorted) => {
    if (signups.length === 0) {
      return;
    }
    let lastInstrument = '';
    return (
      <table className='text-sm table-auto'>
        <thead>
          <tr>
            {showAdminTools ? (
              <>
                <th className='pr-6 text-right'>#</th>
                <th className='text-left'>Namn</th>
                {gig?.checkbox1 && <th className='px-2'>{gig.checkbox1}</th>}
                {gig?.checkbox2 && <th className='px-2'>{gig.checkbox2}</th>}
                <th className='px-1'>Här?</th>
                <th className='px-1'>Vask</th>
              </>
            ) : (
              <th></th>
            )}
          </tr>
        </thead>
        <tbody>
          {signups.map((signup) => {
            const addNewline = signup.instrument.name !== lastInstrument;
            lastInstrument = signup.instrument.name;
            return (
              <React.Fragment key={signup.corpsId}>
                {addNewline && (
                  <tr>
                    <td colSpan={2}>
                      <h5 className='mt-2 first-letter:capitalize'>
                        {toPlural(signup.instrument.name)}
                      </h5>
                    </td>
                  </tr>
                )}
                <tr>
                  <Entry
                    name={signup.corps.displayName}
                    attended={signup.attended}
                    number={signup.corps.number}
                    isAdmin={showAdminTools}
                    setAttendance={(attended) =>
                      editAttendance.mutate({
                        corpsId: signup.corpsId,
                        gigId,
                        attended,
                      })
                    }
                    checkbox1={
                      !!gig?.checkbox1.trim() ? signup.checkbox1 : undefined
                    }
                    checkbox2={
                      !!gig?.checkbox2.trim() ? signup.checkbox2 : undefined
                    }
                    handleDelete={() => handleDelete(signup.corpsId)}
                  />
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    );
  };

  const yesTable = signupsToTable(yesList);
  const maybeTable = signupsToTable(maybeList);
  const noTable = signupsToTable(noList);

  const instrumentCount = useMemo(
    () =>
      yesList?.reduce(
        (acc, signup) => {
          acc[signup.instrument.name] = (acc[signup.instrument.name] ?? 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    [yesList],
  );

  // Get a count of how many people are missing for each instrument
  const missingInstrumentsCount = useMemo(() => {
    const output: Record<string, number> = {};
    FULL_SETTING.forEach(([instrument, count]) => {
      output[instrument] = count - (instrumentCount?.[instrument] ?? 0);
    });
    return Object.entries(output).filter(([_, count]) => count > 0);
  }, [instrumentCount]);

  const missingInstrumentsMessages = useMemo(() => {
    if (missingInstrumentsCount.length === 0) {
      return ['Spelningen har full sättning!'];
    }
    const genMessage = ([instrument, count]: [string, number]) =>
      `${count} ${count > 1 ? toPlural(instrument) : instrument.toLowerCase()}`;
    const message = missingInstrumentsCount.map(genMessage);
    return ['Följande instrument saknas för full sättning:', ...message];
  }, [missingInstrumentsCount]);

  return (
    <div className='space-y-2'>
      {isAdmin && (
        <>
          <Switch
            label='Redigera anmälningar'
            checked={editMode}
            onChange={(val) => {
              setEditMode(val);
              utils.gig.getSignups.invalidate({ gigId });
            }}
          />
        </>
      )}
      {showAdminTools && (
        <form
          onSubmit={form.onSubmit((values) =>
            addSignups.mutateAsync({
              corpsIds: values.corpsIds,
              gigId,
              status: 'Ja',
            }),
          )}
        >
          <div className='flex justify-between flex-grow space-x-4 flex-nowrap'>
            <MultiSelectCorps
              sx={{ width: '100%' }}
              searchable
              placeholder='Välj corps...'
              limit={30}
              maxDropdownHeight={350}
              icon={<IconUser />}
              excludeIds={signups?.map((s) => s.corpsId) ?? []}
              {...form.getInputProps('corpsIds')}
            />
            <Button type='submit'>Lägg till anmälningar</Button>
          </div>
        </form>
      )}
      {signupsLoading && <Loading msg='Laddar anmälningar...' />}
      {!signupsLoading && (
        <div>
          {yesList.length === 0 ? (
            <h3>
              <i>Ingen är anmäld än. Kanske kan du bli den första?</i>
            </h3>
          ) : (
            <>
              <h3>
                {gigHasHappened
                  ? showAdminTools
                    ? 'Dessa var anmälda:'
                    : 'Dessa var med:'
                  : 'Dessa är anmälda:'}
              </h3>
              {yesTable}
            </>
          )}
          {!gigHasHappened && (
            <div>
              <div className='h-4' />
              {missingInstrumentsMessages.map((msg) => (
                <React.Fragment key={msg}>
                  {msg}
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      {maybeList && maybeList.length > 0 && (
        <div>
          {!gigHasHappened && <h3>Dessa kanske kommer:</h3>}
          {maybeTable}
        </div>
      )}
      {isAdmin && noList && noList.length > 0 && (
        <div>
          <h3>Dessa kommer inte:</h3>
          {noTable}
        </div>
      )}
    </div>
  );
};

export default SignupList;
