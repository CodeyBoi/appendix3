import { Select, Skeleton, Stack } from "@mantine/core";
import React from "react";
import { trpc } from "../../utils/trpc";

interface GigSignupBoxProps {
  gigId: number;
}

const GigSignupBox = ({ gigId }: GigSignupBoxProps) => {

  const utils = trpc.useContext();

  const addSignup = trpc.gig.addSignup.useMutation({
    onSuccess: async () => {
      await utils.gig.invalidate();
    },
  });

  const { data: corps, status: corpsStatus } = trpc.corps.getCorps.useQuery();
  const { data: mainInstrument, status: mainInstrumentStatus } = trpc.corps.mainInstrument.useQuery();
  const { data: signup, status: signupStatus } =
    trpc.gig.getSignup.useQuery({ gigId, corpsId: corps?.id ?? -1 }, { enabled: !!corps });

  const [instrument, setInstrument] = React.useState('');
  const [status, setStatus] = React.useState('Ej svarat');

  if (signup && status === 'Ej svarat' && instrument === '') {
    setStatus(signup.status.value);
    setInstrument(signup.instrument.name);
  }

  // const loading = corpsStatus === "loading" || mainInstrumentStatus === "loading" || signupStatus === "loading";
  return (
    <Stack spacing={2}>
      {corps && mainInstrument && (
        <>
          <Select
            mr={8}
            size="xs"
            value={status}
            label="Jag deltar:"
            onChange={s => {
              setStatus(s!);
              addSignup.mutateAsync({ gigId, corpsId: corps.id, status: s!, instrument: instrument });
            }}
            data={[
              { label: 'Ja', value: 'Ja' },
              { label: 'Nej', value: 'Nej' },
              { label: 'Kanske', value: 'Kanske' },
              { label: 'Ej svarat', value: 'Ej svarat' },
            ]}
          />
          {corps?.instruments.length > 1 &&
            <Select
              mr={8}
              size="xs"
              label="Instrument:"
              value={instrument}
              onChange={val => {
                setInstrument(val!);
                addSignup.mutateAsync({ gigId, corpsId: corps.id, status: status, instrument: val! });
              }}
              data={corps.instruments.map(i => ({ label: i.instrument.name, value: i.instrument.name }))}
            />
          }
        </>
      )}
    </Stack>
  );
}

export default GigSignupBox;
