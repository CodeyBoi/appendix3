import {
  Accordion,
  Title,
  Text,
  Stack,
  Box,
  Group,
  Space,
} from "@mantine/core";
import React from "react";
import Datebox from "./datebox";
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
      <Accordion.Item sx={{ border: 0 }} value={gig.id.toString()}>
        <Box sx={{ display: "flex" }}>
          <Accordion.Control sx={{ width: "auto", flexGrow: 1 }}>
            <Group position="left" spacing="xs">
              <Stack spacing={0} align="flex-start">
                <Title order={4}>{gig.title}</Title>
                <Group position="left">
                  <Datebox date={dayjs(gig.date)} />
                  <Stack spacing={0}>
                    <Text size="xs">
                      <i>{gig.type.name}</i>
                    </Text>
                    {gig.location && (
                      <Text size="xs">{`Plats: ${gig.location}`}</Text>
                    )}
                    {gig.meetup && (
                      <Text size="xs">{`Samling: ${gig.meetup}`}</Text>
                    )}
                  </Stack>
                </Group>
              </Stack>
            </Group>
          </Accordion.Control>
          <GigButtons gig={gig} />
        </Box>
        <Accordion.Panel>
          {gig.start && (
            <>
              <Text>
                <i>{`Spelningen börjar ${gig.start}.`}</i>
              </Text>
              <Space h="xs" />
            </>
          )}
          <Text>{gig.description}</Text>
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
              <Title order={4}>{gig.title}</Title>
              <Text size="xs">{gig.type.name}</Text>
              {gig.meetup && <Text size="xs">{`Tarmen: ${gig.meetup}`}</Text>}
            </Stack>
          </Group>
          <GigButtons gig={gig} />
        </Group>
        {gig.start && (
          <Text>
            <i>{`Spelningen börjar ${gig.start}.`}</i>
          </Text>
        )}
        <Text>{gig.description}</Text>
      </Stack>
    );
  }
};

export default GigInfo;
