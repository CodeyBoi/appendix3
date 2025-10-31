import { lang } from 'utils/language';
import PositionInfobox from 'components/corps/position-infobox';
import { api } from 'trpc/server';
import { IconMail } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';


const styrelseOrder: Dictionary<number> = {
  "Ordförande": 1,
  "ViceOrdförande": 2,
  "Sekreterare": 3,
  "Kassör": 4,
};


const Positions = async () => {
  const roles = await api.permission.getRoles.query();
  const ordoredBoardCorps = await Promise.all(
    roles
      .filter(role => Object.keys(styrelseOrder).includes(role.name))
      .sort((a, b) => styrelseOrder[a.name] - styrelseOrder[b.name])
      .flatMap(role =>
        role.corpsii.map(async (corps) => {
          const result = await api.corps.get.query({ id: corps.id });
          if (!result) throw new Error("Corps not found");
          return result;
        })
      )
  );

  const TrivselCorps = await Promise.all(
    roles
      .filter(role => role.name === "Trivselombud")
      .flatMap(role =>
        role.corpsii.map(async (corps) => {
          const result = await api.corps.get.query({ id: corps.id });
          if (!result) throw new Error("Corps not found");
          return result;
        })
      )
  );

  return (
    <div>
      <h2>{lang('Ansvarsposter', 'Positions of responsibility')}</h2>
      <div className='flex max-w-4xl flex-col space-y-4'>
        <div className='rounded border shadow-md dark:border-neutral-800'>
          <div className='flex flex-col space-y-2 p-4'>
            <h3>{lang('styrelsen', 'The Board')}</h3>
            bla bla lite text
            <div className='grid grid-cols-2 gap-4'>
              {ordoredBoardCorps.map((corps) => (
                <div className='rounded border shadow-md dark:border-neutral-800 flex flex-col p-2 text-left text-sm' >
                  {corps.roles.filter(role => Object.keys(styrelseOrder).includes(role.name))[0]?.name}
                  <PositionInfobox corps={corps} />
                </div>
              ))
              }
            </div>
          </div>
        </div>
      </div>

      <div className='max-w-4xl rounded border shadow-md dark:border-neutral-800'>
        <div className='flex flex-col space-y-2 p-4'>
          <h3>Trivselombud</h3>
          bla bla mer text.
          {roles.filter((role) => (
            role.name == "Trivselombud"
          )).map((role) => (
            <div key={role.id} className='grid grid-cols-2 gap-4'>
              {TrivselCorps.map((corps) => (
                <div className='rounded border shadow-md dark:border-neutral-800 flex flex-col p-2 text-left text-sm' >
                  <PositionInfobox corps={corps} />
                </div>
              ))
              }
            </div>
          ))}
        </div>
      </div>

      <div className='max-w-4xl rounded border shadow-md dark:border-neutral-800'>
        <div className='flex flex-col space-y-2 p-4'>
          <h3>Utskott</h3>
          bla bla mer text.
          <div className='flex gap-1'>
            <h4>Pryl och Prov</h4>
            <ActionIcon
              href={`mailto:pryloprov`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          blub


          <h4>PR</h4>
          blab

          <div className='flex gap-1'>
            <h4>ITK</h4>
            <ActionIcon
              href={`mailto:itk@bleckhornen.org`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(`ITK har ansvar för drift av alla Bleckhornens hemsidor, samt vidareutveckling av Blindtarmen.
            Driftansvaret includerar blindtarmen, den publika hemsidan och vår interna wiki.`,
            `ITK has responsibility for the operation of all Bleckhornens websites, as well as developing Blindtarmen.
            The operational responsebility includes Blindtarmen, the public website, and our internal wiki`)}

        </div>
      </div>
    </div>
  );
};

export default Positions;

