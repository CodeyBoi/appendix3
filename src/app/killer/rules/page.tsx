import { lang } from 'utils/language';

const KillerRules = () => {
  return (
    <>
      <h3>{lang('Regler till Killergame', 'Rules for Killergame')}</h3>
      <div className='lang-sv flex max-w-4xl flex-col gap-2 text-left'>
        <p>
          Varje spelare får vid start en (icke-fysisk) lapp med två andra
          spelares namn. Din uppgift är att &quot;döda&quot; corpset på din lapp
          genom att få denne att på något sätt hänvisa till den andra personen
          som också står på lappen. När du lyckats med detta visar du lappen för
          den du dödat och får då deras lapp. På denna lapp står ditt nya offer.
          Den som har flest mord när spelet tar slut vinner!
        </p>

        <h4 className='mt-2'>Förtydliganden</h4>
        <ul className='list-disc pl-4'>
          <li>
            Det räcker inte att höra personen säga namnet. Du måste vara i en
            konversation med personen, antingen ensam eller i grupp.
          </li>
          <li>Mord får ske var som helst, när som helst, och hur som helst.</li>
          <li>Man får inte döda någon om man är död. (duh)</li>
        </ul>
        <h4 className='mt-2'>Övrigt</h4>
        <ul className='list-disc pl-4'>
          <li>
            Registrera dina mord på Blindtarmen genom att skriva in ordet som
            stod på lappen ditt offer hade. Försök att göra detta så snart som
            möjligt efter genomfört mord, så att alla deltagare har en
            uppdaterad lista över vilka som är kvar.
          </li>
        </ul>
        <br />
        <br />
        <b className='text-center text-lg italic'>MÅ BÄSTA CORPS VINNA!</b>
      </div>
      <div className='lang-en flex max-w-4xl flex-col gap-2 text-left'>
        <p>
          At the start of the game, each player receives a (non-physical) piece
          of paper with two other player&apos;s names. Your task is to
          &quot;kill&quot; the corps on your note by getting them to say the
          name of the other person that is also on the note. When you succeed,
          you show the note to the person you killed and then get their note. On
          this note is your new target. Whoever has the most notes when the game
          ends wins!
        </p>
        <h4 className='mt-2'>Clarifications</h4>
        <ul className='list-disc pl-4'>
          <li>
            It is not enough to hear the person say the name. You must be in a
            conversation with the person, either alone or in a group.
          </li>
          <li>Murders may happen anywhere, anytime, in any way.</li>
          <li>You may not kill anyone if you are dead. (duh)</li>
        </ul>
        <h4 className='mt-2'>Other</h4>
        <ul className='list-disc pl-4'>
          <li>
            Register your kills in Blindtarmen by entering the name that was on
            the note your victim had. Try to do this as soon as possible after a
            confirmed kill, so that all participants have an updated list of who
            are still in the game.
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
