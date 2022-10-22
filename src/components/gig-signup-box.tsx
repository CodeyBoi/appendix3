import { Select, Stack } from "@mantine/core";
import axios from "axios";
import React, { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Gig, Corps } from "../src/types/common/main";

interface GigSignupBoxProps {
  gig: Gig;
  corps: Corps;
  value?: string;
}

const GigSignupBox = ({ gig, corps, value }: GigSignupBoxProps) => {

  const queryClient = useQueryClient();

  const handleChange = async (value: string, instrument?: boolean) => {

    const data: any = { gigId: gig.id, corpsId: corps.id };
    if (instrument) {
      data.instrument = value;
    } else {
      data.status = value;
      data.instrument = corps.mainInstrument;
    }

    const res = await axios.post("/api/signup", data);

    if (res.status === 200) {
      queryClient.invalidateQueries(["signup", gig.id]);
    } else {
      console.log(`Error when setting status for gig ${gig.id}`);
    }
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
      {corps.secondaryInstrument &&
        <Select
          mr={8}
          size="xs"
          sx={{ maxWidth: "90px" }}
          label="Instrument:"
          defaultValue={corps.mainInstrument}
          onChange={value => handleChange(value ?? corps.mainInstrument, true)}
          data={[
            { label: corps.mainInstrument, value: corps.mainInstrument },
            { label: corps.secondaryInstrument, value: corps.secondaryInstrument },
          ]}
        />
      }
    </Stack>
  );
}

export default GigSignupBox;
