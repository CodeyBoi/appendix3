import { lang } from 'utils/language';

const KillerRules = () => {
  return (
    <>
      <h3>{lang('Regler till Killergame', 'Rules for Killergame')}</h3>
      <div className='lang-sv flex max-w-4xl flex-col gap-2 text-left'>
        <p>
          Varje spelare får i början av repveckan en lapp med en annan spelares
          namn och ett ord. Din uppgift är att &quot;döda&quot; corpset på din
          lapp genom att få denne att säga ordet som också står på lappen. När
          du har lyckats med detta visar du lappen för den du dödat och får då
          deras lapp. På denna lapp står ditt nya offer. Den som har flest
          lappar när spelet tar slut på lördag klockan 20:00 vinner!
        </p>

        <h4 className='mt-2'>Förtydliganden</h4>
        <ul className='list-disc pl-4'>
          <li>
            Det räcker inte att höra personen säga ordet. Du måste vara i en
            konversation med personen, antingen ensam eller i grupp.
          </li>
          <li>
            Mord får endast ske innanför AF Borgens eller Tarmens (hela husets)
            väggar.
          </li>
          <li>
            Sammansatta ord som innehåller ordet gills. T.ex. hade{' '}
            <i>tandborste</i> gillts om ordet var <i>tand</i>. Även böjda former
            av ordet gills, t.ex. <i>tanden</i>. Synonymer gills dock inte!
          </li>
          <li>Man får inte döda någon om man är död. (duh)</li>
        </ul>
        <h4 className='mt-2'>Övrigt</h4>
        <ul className='list-disc pl-4'>
          <li>
            Se till att närvara så mycket som möjligt (helst hela tiden) under
            repveckan om du är med i Killer. Det är väldigt tråkigt för folk om
            deras offer inte är där.
          </li>
          <li>
            Registrera dina mord på Blindtarmen genom att skriva in ordet som
            stod på lappen ditt offer hade. Försök att göra detta så snart som
            möjligt efter genomfört mord, så att alla deltagare har en
            uppdaterad lista över vilka som är kvar.
          </li>
          <li>
            Ha med dig din lapp eller mobil hela tiden, så att du kan ge
            bort/visa upp den när du har dödat någon (eller blivit dödad).
          </li>
        </ul>
        <br />
        <br />
        <b className='text-center text-lg italic'>MÅ BÄSTA CORPS VINNA!</b>
      </div>
      <div className='lang-en flex max-w-4xl flex-col gap-2 text-left'>
        <p>
          At the beginning of the rehearsal week, each player receives a piece
          of paper with another player&apos;s name and a word. Your task is to
          &quot;kill&quot; the corps on your note by getting them to say the
          word that is also on the note. When you succeed, you show the note to
          the person you killed and then get their note. On this note is your
          new target. Whoever has the most notes when the game ends on Saturday
          at 20:00 (8:00 PM) wins!
        </p>
        <h4 className='mt-2'>Clarifications</h4>
        <ul className='list-disc pl-4'>
          <li>
            It is not enough to hear the person say the word. You must be in a
            conversation with the person, either alone or in a group.
          </li>
          <li>
            Murders may only happen within the walls of AF Borgen or Tarmen (the
            entire house).
          </li>
          <li>You may not kill anyone if you are dead. (duh)</li>
        </ul>
        <h4 className='mt-2'>Other</h4>
        <ul className='list-disc pl-4'>
          <li>
            Make sure to be present as much as possible (preferably all the
            time) during rep week if you&apos;re in Killer. It is very sad for
            people if their target is not there.
          </li>
          <li>
            Register your kills in Blindtarmen by entering the word that was on
            the note your victim had. Try to do this as soon as possible after a
            confirmed kill, so that all participants have an updated list of who
            is still in the game.
          </li>
          <li>
            Carry your note or phone with you at all times, so you can show it
            or give it away when you&apos;ve killed someone (or been killed).
          </li>
        </ul>
        <br />
        <br />
        <b className='text-center text-lg italic'>
          MAY THE GREATEST CORPS WIN!
        </b>
      </div>
    </>
  );
};

export default KillerRules;
