import { LoadingOverlay, Select, Stack } from "@mantine/core";
import React, { useEffect } from "react";
import { trpc } from "../../utils/trpc";

interface GigSignupBoxProps {
  gigId: string;
}

const GigSignupBox = ({ gigId }: GigSignupBoxProps) => {

  const utils = trpc.useContext();

  const addSignup = trpc.gig.addSignup.useMutation({
    onSuccess: async () => {
      if (corps) {
        await utils.gig.getSignup.invalidate({ gigId, corpsId: corps.id });
      }
      await utils.gig.getSignups.invalidate({ gigId });
    },
  });

  const { data: corps } = trpc.corps.getSelf.useQuery();
  const { data: mainInstrument} = trpc.corps.getMainInstrument.useQuery();
  const { data: signup, isLoading: signupLoading } =
    trpc.gig.getSignup.useQuery({ gigId, corpsId: corps?.id ?? "" }, { enabled: !!corps });

  const [instrument, setInstrument] = React.useState('');
  const [status, setStatus] = React.useState('Ej svarat');

  useEffect(() => {
    if (!mainInstrument || signupLoading) {
      return;
    }
    if (!signup) {
      setStatus('Ej svarat');
      setInstrument(mainInstrument.name);
    } else {
      setStatus(signup.status.value);
      setInstrument(signup.instrument.name);
    }
  }, [mainInstrument, signupLoading, signup]);

  const loading = !corps || !mainInstrument || signupLoading;

  return (
    <Stack spacing={2}>
      <div style={{ position: 'relative' }}>
        <LoadingOverlay visible={loading} />
        <Select
          mr={8}
          size="xs"
          value={status}
          label="Jag deltar:"
          onChange={s => {
            if (!s || !corps) {
              return;
            }
            setStatus(s);
            addSignup.mutateAsync({ gigId, corpsId: corps.id, status: s, instrument: instrument });
          }}
          data={[
            { label: 'Ja', value: 'Ja' },
            { label: 'Nej', value: 'Nej' },
            { label: 'Kanske', value: 'Kanske' },
            { label: 'Ej svarat', value: 'Ej svarat' },
          ]}
        />
        {(corps?.instruments.length ?? 0) > 1 && (
          <Select
            mr={8}
            size="xs"
            label="Instrument:"
            value={instrument}
            onChange={val => {
              if (!val || !corps) {
                return;
              }
              setInstrument(val);
              addSignup.mutateAsync({ gigId, corpsId: corps.id, status: status, instrument: val });
            }}
            data={corps?.instruments.map(i => ({ label: i.instrument.name, value: i.instrument.name })) ?? []}
          />
        )}
      </div>
    </Stack>
  );
}

export default GigSignupBox;
