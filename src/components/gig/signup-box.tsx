import { Select, Stack } from "@mantine/core";
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Gig, Corps } from "@prisma/client";
import { trpc } from "../../utils/trpc";

interface GigSignupBoxProps {
  gig: Gig;
  value?: string;
}

const GigSignupBox = ({ gig, value }: GigSignupBoxProps) => {

  const { data: corps, status: corpsStatus } = trpc.corps.getCorps.useQuery();
  const { data: mainInstrument, status: mainInstrumentStatus } = trpc.corps.mainInstrument.useQuery();

  const mainInstrumentName = mainInstrument?.name;

  const handleChange = async (value: string, instrument?: boolean) => {

    const data: any = { gigId: gig.id, corpsId: corps?.id };
    if (instrument) {
      data.instrument = value;
    } else {
      data.status = value;
      // data.instrument = corps.mainInstrument;
    }

    // const res = await axios.post("/api/signup", data);

    // if (res.status === 200) {
    //   queryClient.invalidateQueries(["signup", gig.id]);
    // } else {
    //   console.log(`Error when setting status for gig ${gig.id}`);
    // }
  }

  return (
    <Stack spacing={2}>
      <Select
        mr={8}
        size="xs"
        sx={{ maxWidth: "90px" }}
        value={value ?? "Ej svarat"}
        onChange={handleChange}
        data={[
          { label: 'Ja', value: 'Ja' },
          { label: 'Nej', value: 'Nej' },
          { label: 'Kanske', value: 'Kanske' },
          { label: 'Ej svarat', value: 'Ej svarat' },
        ]}
      />
      {corps && corps.instruments && corps?.instruments.length > 1 &&
        <Select
          mr={8}
          size="xs"
          sx={{ maxWidth: "90px" }}
          label="Instrument:"
          defaultValue={mainInstrumentName ?? ''}
          onChange={value => handleChange(value ?? mainInstrumentName ?? '', true)}
          data={[
            { label: mainInstrumentName ?? '', value: mainInstrumentName ?? '' },
//            { label: corps.secondaryInstrument, value: corps.secondaryInstrument },
          ]}
        />
      }
    </Stack>
  );
}

export default GigSignupBox;
