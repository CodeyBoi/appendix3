import { lang } from 'utils/language';
import PositionInfobox from 'components/corps/position-infobox';
import { api } from 'trpc/server';
import { IconMail } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { filterNone } from 'utils/array';
import React from 'react';

const ALL_BOARD_ROLES = [
  'Ordförande',
  'Vice Ordförande',
  'Sekreterare',
  'Kassör',
] as const;

const InfoPage = async () => {
  const publicRoles = await api.permission.getPublicRoles.query();
  const boardCorps = await Promise.all(
    ALL_BOARD_ROLES.map(async (roleName) => {
      const role = publicRoles.find((role) => role.name === roleName);
      if (!role) {
        throw new Error(
          'Failed when getting board members. The list with board role names in ALL_BOARD_ROLES in src/app/info/page.tsx has probably desynced from the role names defined in the database.',
        );
      }
      const corpsIds = role.corpsii.map((corps) => corps.id);
      return {
        name: roleName,
        corpsii: filterNone(
          await Promise.all(corpsIds.map((id) => api.corps.get.query({ id }))),
        ),
      };
    }),
  );

  const trivselCorps = await Promise.all(
    publicRoles
      .filter((role) => role.name === 'Trivselombud')
      .flatMap((role) =>
        role.corpsii.map(async (corps) => {
          const result = await api.corps.get.query({ id: corps.id });
          if (!result) throw new Error('Corps not found');
          return result;
        }),
      ),
  );

  return (
    <div>
      <h2>{lang('Ansvarsposter', 'Positions of responsibility')}</h2>
      <div className='max-w-4xl'>
        <div className='flex flex-col space-y-2 p-4'>
          <h3>{lang('Styrelsen', 'The Board')}</h3>
          {lang(
            `Styrelsen leder Bleckhornen under ett verksamhetsår. Tillsammans med dirigenter,
          balettledare, utskottsmedlemmar och andra förtroendevalda ansvarar styrelsen för planering
          av repor, spelningar, sittningar, konserter, resor och andra aktiviteter. Detta görs med stöd och
          samarbete med hela corpset.`,

            `The board leads Bleckhornen throughout the year. Together with conductors, ballet leaders,
          committee members, and other elected representatives, the board is responsible for planning
          rehearsals, performances, formal sittings, concerts, trips, and other activities. This is done
          with the support and collaboration of the entire corps.`,
          )}
          <div className='grid grid-cols-1 gap-4 lg:grid-cols-2'>
            {boardCorps.map(({ name, corpsii }) => (
              <div key={name}>
                {corpsii.length > 0 && (
                  <>
                    <h4>{name}</h4>
                    <div className='flex flex-col rounded border p-2 text-left text-sm shadow-md dark:border-neutral-800'>
                      {corpsii.length > 0 &&
                        corpsii.map((corps) => (
                          <PositionInfobox key={corps.id} corps={corps} />
                        ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className='max-w-4xl'>
        <div className='flex flex-col space-y-2 p-4'>
          <h3>Trivselombud</h3>
          {lang(
            `Trivselombuden i Bleckhornen har i uppdrag att bidra till trivsel och trygghet inom
          föreningen. Till oss kan du komma om du känner att du har upplevt något inom Bleckhornen
          som känns fel, eller om du känner att du behöver stöd eller prata om något. Trivselombuden
          kan du alltid komma pch prata med när du känner för det, men du kan också kontakta oss via
          våra formulär, där det även finns möjlighet att vara anonym.`,

            `The Wellbeing Representatives in Bleckhornen are responsible for promoting comfort and
          safety within the association. You can come to us if you've experienced something within
          Bleckhornen that feels wrong, or if you feel that you need support or just someone to talk to.
          You can always approach the Wellbeing Representatives whenever you feel the need, but you
          can also contact us through our forms, where there is also an option to remain anonymous.`,
          )}
          {publicRoles
            .filter((role) => role.name == 'Trivselombud')
            .map((role) => (
              <div
                key={role.id}
                className='grid grid-cols-1 gap-4 lg:grid-cols-2'
              >
                {trivselCorps.map((corps) => (
                  <div
                    key={`Trivselombudbox:${corps.id}`}
                    className='flex flex-col rounded border p-2 text-left text-sm shadow-md dark:border-neutral-800'
                  >
                    <PositionInfobox corps={corps} />
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>

      <div className='max-w-4xl'>
        <div className='flex flex-col space-y-2 p-4'>
          <h3>Utskott</h3>
          {lang(
            `I Bleckhornen finns flera utskott, där varje utskott har sina specifika uppgifter.
            Tillsammans ser de till att föreningen fungerar smidigt och utvecklas.
            Det finns ett utskott för alla, där din kreativitet och personlighet får flöda.
            Samtidigt får du även chansen att lära känna personer från olika sektioner.`,

            `In Bleckhornen, there are several committees, each with its own specific tasks.
            Together, they ensure that the association runs smoothly and continues to develop.
            There’s a committee for everyone, where your creativity and personality can shine.
            At the same time, you also get the chance to meet and get to know people from different sections.`,
          )}

          <div className='flex gap-1'>
            <h4>Notmarskeriet</h4>
            <ActionIcon
              href={`mailto:notmarsk.bleckhornen@gmail.com`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `Notmarskeriet ansvarar för alla Bleckhornens noter. Detta innebär att vi skriver ut 📠, sätter
          in 📒, och arkiverar alla de noter som finns i våra pärmar och häften! Arbetsbördan som
          notmarsk är generellt koncentrerad runt julkoncerten och karnevalerna, och då kan den vara
          rätt stor, men under den tidiga hösten och samt så gott som hela våren de år Lund ej gästas av
          karneval är oftast relativt lite att göra.`,

            `The "Notmarskeri" (roughly "Note Marshallery") is responsible for Bleckhornen's sheet
          music. This means that we print 📠, insert 📒, and archive all the sheet music that can be
          found in our folders and booklets! A note marshal's workload is typically concentrated
          around the Christmas concert and the Karnevals, and at those points it can be a bit, but early
          Autumn and basically all of the spring semester (on non-karneval years) are typically very
          free`,
          )}

          <div className='flex gap-1'>
            <h4>Arkivet</h4>
            <ActionIcon
              href={`mailto:arkivet.bleckhornen@gmail.com`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `Arkivet är utskottet som förevigar allt skoj! Vi ser till att spara minnen från det roliga vi gör,
          bland annat i form av bilder, filmer och affischer som corps har producerat. Vi sparar också
          resultat av det slit andra funktionärer lägger ner, som corpset skulle kunna behöva i
          framtiden.`,

            `The Archive is the committee that immortalizes all the fun! We make sure to preserve
          memories from all the enjoyable things we do. For example, in the form of photos, videos,
          and posters produced by the corps. We also keep the results of the hard work put in by other
          functionaries, which the corps might need in the future.`,
          )}

          <div className='flex gap-1'>
            <h4>PR</h4>
            <ActionIcon
              href={`mailto:bleckhornen.pr@gmail.com`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `PR är utskottet som ser till att vi syns och hörs även utöver spelningarna! Vårt arbete är
          främst att sköta våra sociala medier och fota på spelningar. Inför julkonserten gör vi även
          affischerna, programbladen och söker spons. I detta utskott får kreativa idéer komma till liv!`,

            `PR is the committee that makes sure we’re seen and heard even beyond our performances!
          Our work mainly involves managing our social media and taking photos at gigs. Before the
          Christmas concert, we also create the posters and programs and handle sponsorships. In this
          committee, creative ideas come to life!`,
          )}

          <div className='flex gap-1'>
            <h4>Baren</h4>
            <ActionIcon
              href={`mailto:baren.bleckhornen@gmail.com`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `Det är baren som förser corpset med grogg! (Ber du snällt kanske du till och med kan få en drink 😉)
          Den första torsdagen varje månad bjuder vi in till extra festlig eftersits med extra festlig dryck!
          Vi serverar dessutom fördrink inför corpsafton, och rattar Bussbaren hela vägen upp till SOF och STORK.
          Eins, zwei, drei, gesoffa!`,

            `The Bar is the committee that keeps the corps supplied with drinks! (If you ask nicely, you might even get a cocktail 😉)
          On the first Thursday of every month, we host an extra festive afterparty with extra festive beverages!
          We also serve pre-drinks before corps evenings and run the Bus Bar all the way to SOF and STORK.`,
          )}

          <div className='flex gap-1'>
            <h4>Sexmästeriet</h4>
          </div>
          {lang(
            `Sexmästeriet är utskottet som ser till att ingen går hungrig! Vi lagar mat inför både Vårcorps och Höstcorps,
          och ser till att hela corpset får njuta av god mat.
          Tillsammans handlar vi ingredienser, lagar maten och har det riktigt roligt!
          Som medlem i Sexmästeriet får du också vara med och bestämma vad som ska lagas (och presentera maten under middagarna).`,

            `The Culinary Committee makes sure no one goes hungry!
          We cook for both Vårcorps and Höstcorps, making sure the whole corps gets to enjoy tasty food.
          Together, we shop for ingredients, cook, and have a lot of fun along the way!
          As a member, you also get to help decide what’s on the menu (and show off your creations at the dinners).`,
          )}

          <div className='flex gap-1'>
            <h4>ITK</h4>
            <ActionIcon href={`mailto:itk@bleckhornen.org`} variant='subtle'>
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `ITK har ansvar för drift av alla Bleckhornens hemsidor, samt vidareutveckling av Blindtarmen.
            Driftansvaret includerar Blindtarmen, den publika hemsidan och vår interna wiki.`,

            `ITK has responsibility for the operation of all Bleckhornens websites, as well as developing Blindtarmen.
            The operational responsebility includes Blindtarmen, the public website, and our internal wiki`,
          )}

          <div className='flex gap-1'>
            <h4>Pryl & prov</h4>
            <ActionIcon
              href={`mailto:prylochprovbleckhornen@gmail.com `}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `I pryl & prov har vi ansvar för corpsets merch och provelever!
          Vi försöker se till att proveleverna känner sig välkomna i föreningen
          och att de alltid har någon att rikta frågor till om föreningen.
          Detta gör vi genom att anordna tillställningar som t.ex. provelevsfördrinkar och en provelevsdag!
          När det kommer till merchen köper vi in och säljer föreningens merch,
          och ibland när vi får feeling designar vi också ny merch!!`,

            `In Pryl & Prov, we’re responsible for the corps’ merch and for the newmembers!
          We make sure that new members feel welcome in Bleckhornen
          and that they always have someone to turn to with questions about how things work.
          We do this by organizing events such as pre-drinks for the new members and a special probationary members’ day!
          When it comes to merch, we handle the purchasing and sales of the orchestra's merchandise and sometimes,
          when we’re feeling inspired, we even design new merch ourselves!`,
          )}

          <div className='flex gap-1'>
            <h4>Materialförvaltarna</h4>
            <ActionIcon
              href={`mailto:materialforvaltare.bleckhornen@gmail.com `}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `Materialförvaltarna tar hand om och utvecklar Tarmen och ser till Bleckhornens prylar fungerar.
          Har du ett roligt projekt du skulle vilja genomföra kan du alltid dryfta din idé med oss för att få tips och stöd.`,

            `The materials managers take care of and develop Tarmen and make sure the Bleckhorns’ equipment works.
          If you have a fun project you’d like to carry out, you can always discuss your idea with us to get tips and support.`,
          )}

          <div className='flex gap-1'>
            <h4>Medaljeriet</h4>
            <ActionIcon
              href={`mailto:medaljeriet.bleckhornen@gmail.com`}
              variant='subtle'
            >
              <IconMail />
            </ActionIcon>
          </div>
          {lang(
            `Vi i Medaljeriet håller koll på vilka medaljer som ska köpas in och delas ut
          och ger på så sätt corpsaftnarna och julkoncertsbanketten det där lilla extra!
          Vi designar också de temaenliga julkoncertsmedaljerna varje år!
          Utskottets finurliga tolkning av temat blir en fin souvenir till alla deltagande corps.`,

            `We in the Medal committee keep track of which medals are to be ordered and given out,
          and thus we bring that extra shine to the dinner parties and the Christmas concert banquet!
          We also design the Christmas concert medals in accordance with the concert's theme each year!
          The committee's clever interpretation of the theme ends up as a nice souvenir for all participating corps.`,
          )}

          <div className='flex gap-1'>
            <h4>Import</h4>
          </div>
          {lang(
            `Vi i importen ser till att det finns den finaste ölen och cidern.
          Därför åker vi på roadtrips över Öresund och med färjan över Fehmarnbältet för att köpa de bästa danska produkterna i Tyskland.`,

            `We from the import committee make sure with the finest beer and cider.
          Therefore we go on roadtrips across the Öresund and with the ferry over Fehmarn belt to buy the best Danish products in Germany.`,
          )}

          <div className='flex gap-1'>
            <h4>Export</h4>
          </div>
          {lang(
            `Vi i Exporten ser till att corpset aldrig går hungriga!
          Vi fyller på med snacks, dryck och såklart billys!
          Oavsett om det är rep, spelning, så ser vi till att corpset håller humöret på topp.`,

            `Exporten makes sure the corps never goes hungry!
          We keep the snacks and drinks flowing and of course, plenty of Billy’s!
          Whether it’s a rehearsal or a gig, we make sure the corps stays happy, energized, and ready to play.`,
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoPage;
