import { Accordion, Title, Text, Stack, Box, Group } from "@mantine/core";
import React from "react";
import Datebox from "./datebox";
import GigDetails from "./details";
import GigButtons from "./buttons";
import dayjs from "dayjs";
import { Gig } from "@prisma/client";

interface GigProps {
  gig: Gig & { type: { name: string } };
  inAccordion?: boolean;
}

const GigInfo = ({ gig, inAccordion }: GigProps) => {
  if (inAccordion) {
    return (
      <Accordion.Item value={gig.id.toString()}>
        <Box sx={{ display: "flex" }}>
          <Accordion.Control sx={{ width: "auto", flexGrow: 1 }}>
            <Group position="left" spacing="xs">
              <Datebox date={dayjs(gig.date)} />
              <Stack spacing={0} align="flex-start">
                <Title order={3} sx={{ fontWeight: 600 }}>
                  {gig.title}
                </Title>
                <Text sx={{ fontSize: 13 }}>{gig.type.name}</Text>
                {gig.meetup && (
                  <Text sx={{ fontSize: 13 }}>{`Tarmen: ${gig.meetup}`}</Text>
                )}
                {gig.start && (
                  <Text sx={{ fontSize: 13 }}>{`Spelning: ${gig.start}`}</Text>
                )}
              </Stack>
            </Group>
          </Accordion.Control>
          <GigButtons gig={gig} />
        </Box>
        <Accordion.Panel>
          <GigDetails description={gig.description ?? ""} />
        </Accordion.Panel>
      </Accordion.Item>
    );
  } else {
    return (
      // TODO: Make this not look ugly
      <Stack>
        <Group align="apart">
          <Group position="left">
            <Datebox date={dayjs(gig.date)} />
            <Stack spacing={0} align="flex-start">
              <Title order={3} sx={{ fontWeight: 600 }}>
                {gig.title}
              </Title>
              <Text sx={{ fontSize: 13 }}>{gig.type.name}</Text>
              {gig.meetup && (
                <Text sx={{ fontSize: 13 }}>{`Tarmen: ${gig.meetup}`}</Text>
              )}
              {gig.start && (
                <Text sx={{ fontSize: 13 }}>{`Spelning: ${gig.start}`}</Text>
              )}
            </Stack>
          </Group>
          <GigButtons gig={gig} />
        </Group>
        <GigDetails description={gig.description ?? ""} />
      </Stack>
    );
  }
};

export default GigInfo;
