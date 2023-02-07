import { Title, Text, Stack, Group, Card, UnstyledButton, Grid } from "@mantine/core";
import React from "react";
import Datebox from "./datebox";
import GigButtons from "./buttons";
import dayjs from "dayjs";
import { Gig } from "@prisma/client";
import { NextLink } from "@mantine/next";

interface GigProps {
  gig: Gig & { type: { name: string } };
}

const GigCard = ({ gig }: GigProps) => {
  return (
    <Card shadow="sm" p="md" withBorder style={{ overflow: "visible" }}>
      <Stack spacing="sm">
        <Grid>
          <Grid.Col span={12} md={8}>
            <UnstyledButton
              component={NextLink}
              href={`/gig/${gig.id}`}
              style={{ flexGrow: 1 }}
            >
              <Stack spacing="sm">
                <Title order={5}>{gig.title}</Title>
                <Group position="left">
                  <Datebox date={dayjs(gig.date)} />
                  <Text size="xs">
                    <i>{gig.type.name}</i>
                    <br />
                    {gig.location && `Plats: ${gig.location}`}
                    {gig.location && <br />}
                    {gig.meetup && `Samling: ${gig.meetup}`}
                    {gig.meetup && <br />}
                    {gig.start && `Spelstart: ${gig.start}`}
                  </Text>
                </Group>
              </Stack>
            </UnstyledButton>
          </Grid.Col>
          <Grid.Col span={12} md={4}>
            <GigButtons gig={gig} />
          </Grid.Col>
        </Grid>
        <Text size="sm">{gig.description}</Text>
      </Stack>
    </Card>
  );
};

export default GigCard;
