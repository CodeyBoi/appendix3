import { Accordion, Title, Text, Stack, Box } from "@mantine/core";
import React from "react";
import Datebox from "./datebox";
import { useQuery } from "@tanstack/react-query";
import GigDetails from "./details";
import GigButtons from "./buttons";
import dayjs from "dayjs";
import { Gig } from "@prisma/client";

interface GigProps {
  gig: Gig & { type: { name: string } };
  inAccordion?: boolean;
}

const GigInfo = ({ gig, inAccordion }: GigProps) => {

  // const { data: corps, status: corpsStatus } = useQuery<Corps>(["corps"], fetchCorps);
  // const { data: gig, status: gigStatus } = useQuery<Gig>(
  //   ["gig", gigId],
  //   async () => (await axios.get(`/api/gig/${gigId}`)).data,
  //   { enabled: !!gigId },
  // );

  // if (gigStatus === 'loading' || corpsStatus === 'loading') {
  //   return null;
  // } else if (gigStatus === 'error') {
  //   return <AlertError msg="Det gick inte att hämta spelningen :(" />;
  // }

  const output = (
    <Accordion.Item value={gig.id.toString()} py={3}>
      <Box sx={{ display: "flex" }} >
        <Accordion.Control icon={<Datebox date={dayjs(gig.date)} />} sx={{ width: "auto", flexGrow: 1 }} py={4}>
          <Stack spacing={0} align="flex-start">
            <Title order={3} sx={{ fontWeight: 600 }}>{gig.title}</Title>
            <Text sx={{ fontSize: 13 }}>{gig.type.name}</Text>
            {gig.meetup && <Text sx={{ fontSize: 13 }}>{`Tarmen: ${gig.meetup}`}</Text>}
            {gig.start && <Text sx={{ fontSize: 13 }}>{`Spelning: ${gig.start}`}</Text>}
          </Stack>
        </Accordion.Control>
        <GigButtons gig={gig} />
      </Box>
      <Accordion.Panel>
        <GigDetails description={gig.description ?? ''} />
      </Accordion.Panel>
    </Accordion.Item>
  );

  if (inAccordion) {
    return output;
  } else {
    return <Accordion variant="filled" radius="xl">{output}</Accordion>;
  }
}

export default GigInfo;