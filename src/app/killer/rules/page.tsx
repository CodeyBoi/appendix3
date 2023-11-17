const KillerRules = () => {
  return (
    <div className='flex max-w-4xl flex-col text-left'>
      <h3>Regler till Killergame</h3>
      <p>
        Varje spelare får i början av repveckan en lapp med ett annat corps namn
        och ett ord. Din uppgift är att &quot;döda&quot; corpset på din lapp
        genom att få denne att säga ordet som också står på lappen. När du har
        lyckats med detta visar du lappen för den du dödat och får då deras
        lapp. På denna lapp står ditt nya offer. Den som har flest lappar när
        spelet tar slut på lördag klockan 20:00 vinner!
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
      <h4 className='mt-2'>Övriga grejer</h4>
      <ul className='list-disc pl-4'>
        <li>
          Se till att närvara så mycket som möjligt (helst hela tiden) under
          repveckan om du är med i Killer. Det är väldigt tråkigt för folk om
          deras offer inte är där.
        </li>
        <li>
          Registrera dina mord på Blindtarmen genom att skriva in ordet som stod
          på lappen ditt offer hade. Försök att göra detta så snart som möjligt
          efter genomfört mord, så att alla deltagare har en uppdaterad lista
          över vilka som är kvar.
        </li>
        <li>
          Ha med dig din lapp eller mobil hela tiden, så att du kan ge bort/visa
          upp den när du har dödat någon (eller blivit dödad).
        </li>
      </ul>
      <br />
      <b className='text-center text-lg italic'>MÅ BÄSTA CORPS VINNA!</b>
    </div>
  );
};

export default KillerRules;
