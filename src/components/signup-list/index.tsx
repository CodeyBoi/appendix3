'use client';

import { useForm } from '@mantine/form';
import { IconPlus, IconUser } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';
import Loading from 'components/loading';
import SelectCorps from 'components/select-corps';
import Entry from './entry';
import Switch from 'components/input/switch';
import { api } from 'trpc/react';
import useLanguage, { Language } from 'hooks/use-language';
import { lang } from 'utils/language';
import ActionIcon from 'components/input/action-icon';
import Restricted from 'components/restricted/client';
import { aprilFoolsInstrumentLabel } from 'utils/date';

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

const pluralInstruments: Record<string, { sv: string; en: string }> = {
  piccola: {
    sv: 'piccolor',
    en: 'piccolos',
  },
  oboe: {
    sv: 'oboer',
    en: 'oboes',
  },
  flöjt: {
    sv: 'flöjter',
    en: 'flutes',
  },
  klarinett: {
    sv: 'klarinetter',
    en: 'clarinets',
  },
  fagott: {
    sv: 'fagotter',
    en: 'bassoons',
  },
  basklarinett: {
    sv: 'basklarinetter',
    en: 'bass clarinets',
  },
  sopransax: {
    sv: 'sopransaxar',
    en: 'soprano saxes',
  },
  altsax: {
    sv: 'altsaxar',
    en: 'alto saxes',
  },
  tenorsax: {
    sv: 'tenorsaxar',
    en: 'tenor saxes',
  },
  barytonsax: {
    sv: 'barytonsaxar',
    en: 'baritone saxes',
  },
  horn: {
    sv: 'horn',
    en: 'horns',
  },
  trumpet: {
    sv: 'trumpeter',
    en: 'trumpets',
  },
  trombon: {
    sv: 'tromboner',
    en: 'trombones',
  },
  eufonium: {
    sv: 'eufonier',
    en: 'euphoniums',
  },
  tuba: {
    sv: 'tubor',
    en: 'tubas',
  },
  slagverk: {
    sv: 'slagverkare',
    en: 'percussionists',
  },
  balett: {
    sv: 'baletter',
    en: 'ballets',
  },
  dirigent: {
    sv: 'dirigenter',
    en: 'conductors',
  },
};

const toPlural = (instrument: string, language: Language = 'sv') => {
  instrument = instrument.trim().toLowerCase();
  const plural = pluralInstruments[instrument]?.[language];
  return plural ?? instrument;
};

const SignupList = ({ gigId }: SignupListProps) => {
  const utils = api.useUtils();
  const { language } = useLanguage();

  const { data: gig } = api.gig.getWithId.useQuery({ gigId });

  const gigHasHappened = gig
    ? gig.date.getTime() < new Date().getTime() - 1000 * 60 * 60 * 24
    : false;

  const { data: signups, isInitialLoading: signupsLoading } =
    api.gig.getSignups.useQuery({ gigId });

  const [editMode, setEditMode] = useState(false);

  const { data: userPermissions } = api.permission.getOwnPermissions.useQuery();
  const showAdminTools = userPermissions?.has('manageAttendance') && editMode;

  const { data: instruments } = api.instrument.getAll.useQuery();
  // An object which maps instrument names to their position in the INSTRUMENTS array
  const instrumentPrecedence: Record<string, number> = useMemo(
    () =>
      instruments?.reduce((acc, instrument) => {
        (acc as Record<string, number>)[instrument.name] = instrument.id;
        return acc;
      }, {}) ?? [],
    [instruments],
  );
  // Hack to make sure the conductor is always first
  instrumentPrecedence.Dirigent = -1;

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

          // Compare ballet numbers
          if (a.corps.bNumber || b.corps.bNumber) {
            return (a.corps.bNumber || Infinity) - (b.corps.bNumber || Infinity);
          }

          // Compare last name
          if (a.corps.lastName !== b.corps.lastName) {
            return a.corps.lastName.localeCompare(b.corps.lastName, 'sv');
          }

          // Compare first name
          return a.corps.firstName.localeCompare(b.corps.firstName, 'sv');
        }) ?? [],
    [signups, instrumentPrecedence, gigHasHappened, showAdminTools],
  );

  // Divide the list of corpsii into people who answered yes and people who answered maybe
  const splitList = signupsSorted.reduce(
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

  const yesList = splitList.yesList;
  const maybeList = splitList.maybeList;
  const noList = splitList.noList;

  const form = useForm({
    initialValues: { corpsId: '' },
    validate: {
      corpsId: (value) => (value ? null : 'Välj ett corps'),
    },
  });

  const addSignup = api.gig.addSignup.useMutation({
    onMutate: () => {
      form.reset();
    },
    onSettled: async () => {
      await utils.gig.getSignups.invalidate({ gigId });
    },
  });

  const editAttendance = api.gig.editAttendance.useMutation();

  const removeSignup = api.gig.removeSignup.useMutation({
    onSuccess: async ({ corpsId, gigId }) => {
      await utils.gig.getSignup.invalidate({ corpsId, gigId });
      await utils.gig.getSignups.invalidate({ gigId });
    },
  });

  const handleDelete = (corpsId: string) => {
    if (window.confirm('Är du säker på att du vill ta bort anmälningen?')) {
      removeSignup.mutate({ corpsId, gigId });
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
      <table className='table-auto text-sm'>
        <thead>
          <tr>
            {showAdminTools ? (
              <>
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
                      <h6 className='mt-2 first-letter:capitalize'>
                        {toPlural(
                          aprilFoolsInstrumentLabel(signup.instrument.name),
                          language,
                        )}
                      </h6>
                    </td>
                  </tr>
                )}
                <tr>
                  <Entry
                    corps={signup.corps}
                    attended={signup.attended}
                    showAdminTools={showAdminTools}
                    setAttendance={(attended) => {
                      editAttendance.mutate({
                        corpsId: signup.corpsId,
                        gigId,
                        attended,
                      });
                    }}
                    checkbox1={
                      gig?.checkbox1.trim() ? signup.checkbox1 : undefined
                    }
                    checkbox2={
                      gig?.checkbox2.trim() ? signup.checkbox2 : undefined
                    }
                    handleDelete={() => {
                      handleDelete(signup.corpsId);
                    }}
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
      yesList.reduce<Record<string, number>>((acc, signup) => {
        acc[signup.instrument.name] = (acc[signup.instrument.name] ?? 0) + 1;
        return acc;
      }, {}),
    [yesList],
  );

  // Get a count of how many people are missing for each instrument
  const missingInstrumentsCount = useMemo(() => {
    const output: Record<string, number> = {};
    FULL_SETTING.forEach(([instrument, count]) => {
      output[instrument] = count - (instrumentCount[instrument] ?? 0);
    });
    return Object.entries(output).filter(([_, count]) => count > 0);
  }, [instrumentCount]);

  const missingInstrumentsMessages = useMemo(() => {
    if (missingInstrumentsCount.length === 0) {
      return [lang('Spelningen har full sättning!', 'Full setting!')];
    }
    const genMessage = ([instrument, count]: [string, number]) =>
      `${count} ${
        count > 1 ? toPlural(instrument, language) : instrument.toLowerCase()
      }`;
    const message = missingInstrumentsCount.map(genMessage);
    return [
      lang(
        'Följande instrument saknas för full sättning:',
        'Missing instruments for full setting:',
      ),
      ...message,
    ];
  }, [missingInstrumentsCount, language]);

  return (
    <div className='space-y-2'>
      <Restricted permissions='manageAttendance'>
        <Switch
          label={lang('Redigera anmälningar', 'Edit signups')}
          checked={editMode}
          onChange={(val) => {
            setEditMode(val);
            void utils.gig.getSignups.invalidate({ gigId });
          }}
        />
      </Restricted>
      {showAdminTools && (
        <form
          onSubmit={form.onSubmit((values) => {
            addSignup.mutate({
              corpsId: values.corpsId,
              gigId,
              status: 'Ja',
              checkbox1: false,
              checkbox2: false,
            });
          })}
        >
          <div className='flex flex-nowrap gap-4'>
            <SelectCorps
              label={lang('Välj corps...', 'Select corps...')}
              icon={<IconUser />}
              excludeIds={signups?.map((s) => s.corpsId) ?? []}
              {...form.getInputProps('corpsId')}
            />
            <ActionIcon type='submit'>
              <IconPlus />
            </ActionIcon>
          </div>
        </form>
      )}
      {signupsLoading && (
        <Loading msg={lang('Hämtar anmälningar...', 'Fetching signups...')} />
      )}
      {!signupsLoading && (
        <div>
          {yesList.length === 0 ? (
            <h3>
              <i>
                {lang(
                  'Ingen är anmäld än. Kanske kan du bli den första?',
                  'No one is signed up yet. Maybe you can be the first one?',
                )}
              </i>
            </h3>
          ) : (
            <>
              <h3>
                {gigHasHappened
                  ? showAdminTools
                    ? lang('Dessa var anmälda:', 'These were signed up:')
                    : lang('Dessa var med:', 'These were there:')
                  : lang('Dessa är anmälda:', 'These are signed up:')}
              </h3>
              {yesTable}
            </>
          )}
          {!gigHasHappened && (
            <div>
              <div className='h-4' />
              {missingInstrumentsMessages.map((msg, i) => (
                <React.Fragment key={i}>
                  {msg}
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      )}
      {maybeList.length > 0 && (
        <div>
          {!gigHasHappened && (
            <h3>{lang('Dessa kanske kommer:', 'These might come:')}</h3>
          )}
          {maybeTable}
        </div>
      )}
      {noList.length > 0 && (
        <Restricted permissions='manageAttendance'>
          <div>
            <h3>{lang('Dessa kommer inte:', 'These are not coming:')}</h3>
            {noTable}
          </div>
        </Restricted>
      )}
    </div>
  );
};

export default SignupList;
