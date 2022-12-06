import React, { useState } from "react";
import {
  Table,
  Tabs,
  Select,
  Group,
  Title,
  Stack,
  Accordion,
} from "@mantine/core";
import { trpc } from "../../utils/trpc";
import { getOperatingYear } from "../stats/[paramYear]";
import Link from "next/link";
import Loading from "../../components/loading";
import dayjs from "dayjs";

type Tab = "all-gigs-tab" | "my-gigs-tab";
interface GigsProps {
  initialTab?: Tab;
}

const Gigs = ({ initialTab = "my-gigs-tab" }: GigsProps) => {
  const [year, setYear] = useState(getOperatingYear());
  const [activeTab, setActiveTab] = useState<string | null>(initialTab);
  // TODO: FIX THIS (I HATE DATES (this gets the day before the current day))
  const startDate = new Date(year, 8, 1);
  const endDate = new Date(year + 1, 7, 31);
  const { data: allGigs, isLoading: allGigsLoading } =
    trpc.gig.getMany.useQuery(
      { startDate, endDate, dateOrder: "desc" },
      { enabled: activeTab === "all-gigs-tab" }
    );
  const { data: myGigs, isLoading: myGigsLoading } =
    trpc.gig.getAttended.useQuery(
      { startDate, endDate },
      { enabled: activeTab === "my-gigs-tab" }
    );

  const loading =
    (allGigsLoading && activeTab === "all-gigs-tab") ||
    (myGigsLoading && activeTab === "my-gigs-tab");

  let startYear = 2010;
  const endYear = new Date().getFullYear();

  const years = [];
  for (let i = startYear; i <= endYear; i++) {
    const year = {
      value: startYear.toString(),
      label: startYear.toString() + "-" + (startYear + 1).toString(),
    };
    years.unshift(year);
    startYear++;
  }

  let lastGigMonth: number;

  const currentGigs = activeTab === "my-gigs-tab" ? myGigs : allGigs;

  const gigTable = loading ? (
    <Loading msg="Laddar spelningar..." />
  ) : currentGigs && currentGigs.length > 0 ? (
    <Table fontSize={12} highlightOnHover>
      <tbody>
        {currentGigs.map((gig) => {
          const gigMonth = gig.date.getMonth();
          let shouldAddMonth = false;
          if (gigMonth !== lastGigMonth) {
            lastGigMonth = gigMonth;
            shouldAddMonth = true;
          }
          return (
            <React.Fragment key={gig.id}>
              {shouldAddMonth && (
                // We set color to unset to get rid of the highlightOnHover for the month
                <tr style={{ backgroundColor: "unset" }}>
                  <td colSpan={12}>
                    <Title order={4}>
                      {gig.date.toLocaleString("sv-SE", { month: "long" })}
                    </Title>
                  </td>
                </tr>
              )}
              <Link href={`/gig/${gig.id}`} key={gig.id}>
                <tr style={{ cursor: "pointer" }}>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {dayjs(gig.date).format("YYYY-MM-DD")}
                  </td>
                  <td>{gig.title}</td>
                </tr>
              </Link>
            </React.Fragment>
          );
        })}
      </tbody>
    </Table>
  ) : (
    <Title order={4}>Här fanns inget att se :/</Title>
  );

  return (
    <Stack sx={{ maxWidth: 500 }}>
      <Title order={2}>Gamla spelningar</Title>
      <Group position="left">
        <Select
          label="Verksamhetsår"
          defaultValue={getOperatingYear().toString()}
          maxDropdownHeight={280}
          data={years}
          value={year.toString()}
          onChange={(value) => setYear(parseInt(value as string))}
        />
      </Group>
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <Tabs.List pl={8}>
          <Tabs.Tab value="my-gigs-tab">Mina spelningar</Tabs.Tab>
          <Tabs.Tab value="all-gigs-tab">Alla spelningar</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="my-gigs-tab" pt="xs">
          {gigTable}
        </Tabs.Panel>

        <Tabs.Panel value="all-gigs-tab" pt="xs">
          {gigTable}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Gigs;
