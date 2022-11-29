import React from 'react';
import { Text, Table, Tabs, Select, Center} from '@mantine/core';
import { NextPage } from 'next';
import { trpc } from '../../utils/trpc';

const Gigs: NextPage = () => {
  const { data: corps } = trpc.corps.getSelf.useQuery();
  const { data: allGigs, isLoading: allGigsLoading } = trpc.gig.getMany.useQuery({});
  // make a new query for myGigs
  const { data: myGigs, isLoading: myGigsLoading } = trpc.gig.getAttended.useQuery(
    { corpsId: corps?.id ?? "" },
    { enabled: !!corps },
  );

  const loading = allGigsLoading || myGigsLoading;
  const ref = React.useRef<HTMLInputElement>(null);

  let startYear = 2010;
  const endDate = new Date().getFullYear();
  const years = [];

  for (let i = startYear; i <= endDate; i++) {
    const year = { value: startYear.toString(), label: startYear.toString() };
    years.unshift(year);
    startYear++;
  }

  let lastGigMonth: number;

  return (
    <>
      <Tabs color="gray" variant="outline" defaultValue="myGigs">

        <Tabs.List >
          <Tabs.Tab value="myGigs" style={{ marginLeft: "auto"}}>Mina Spelningar</Tabs.Tab>
          <Tabs.Tab value="allGigs" style={{ marginRight: "auto"}}>Alla Spelningar</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="myGigs" pt="xs">
        <Table fontSize={12}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Spelning</th>
              <th>Beskrivning</th>
            </tr>
          </thead>
          <tbody>
            {myGigs?.map((gig) => {
              const gigMonth = gig.date.getMonth();
              let shouldAddMonth = false;
              if (gigMonth !== lastGigMonth) {
                lastGigMonth = gigMonth;
                shouldAddMonth = true;
              }
              return (
                <>
                  {shouldAddMonth && <tr><td style={{ fontSize: "14px", fontWeight: "bold" }} colSpan={3}>{gig.date.toLocaleString('sv-SE', { month: 'long' })}</td></tr>}
                  <tr key={gig.id}>
                    <td><Text>{gig.date.toLocaleDateString()}</Text></td>
                    <td style={{ minWidth: "20%" }}><Text>{gig.title}</Text></td>
                    <td><Text>{gig.description}</Text></td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
        </Tabs.Panel>

        <Tabs.Panel value="allGigs" pt="xs" >
          <Center>
          <Select style={{ marginRight: "auto", marginBottom: "30px"}}
            label="Välj År"
            placeholder="2022"
            searchable
            nothingFound="No options"
            maxDropdownHeight={280}
            data={years}
            ref={ref} />
          </Center>
        <Table fontSize={12}>
          <thead>
            <tr>
              <th>Datum</th>
              <th>Spelning</th>
              <th>Beskrivning</th>
            </tr>
          </thead>
          <tbody>
            {allGigs?.map((gig) => {
              const gigMonth = gig.date.getMonth();
              let shouldAddMonth = false;
              if (gigMonth !== lastGigMonth) {
                lastGigMonth = gigMonth;
                shouldAddMonth = true;
              }
              return (
                <>
                  {shouldAddMonth && <tr><td style={{ fontSize: "14px", fontWeight: "bold" }} colSpan={3}>{gig.date.toLocaleString('sv-SE', { month: 'long' })}</td></tr>}
                  <tr key={gig.id}>
                    <td><Text>{gig.date.toLocaleDateString()}</Text></td>
                    <td style={{ minWidth: "20%" }}><Text>{gig.title}</Text></td>
                    <td><Text>{gig.description}</Text></td>
                  </tr>
                </>
              );
            })}
          </tbody>
        </Table>
        </Tabs.Panel>
      </Tabs>
    </>
  );
};

export default Gigs;
