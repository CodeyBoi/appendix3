import { SegmentedControl, Select, Stack } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import FormLoadingOverlay from "../form-loading-overlay";

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
      setSubmitting(false);
    },
  });

  const { data: corps } = trpc.corps.getSelf.useQuery();
  const { data: mainInstrument} = trpc.corps.getMainInstrument.useQuery();
  const { data: signup, isInitialLoading: signupInitLoad, isRefetching: signupRefetching } =
    trpc.gig.getSignup.useQuery({ gigId, corpsId: corps?.id ?? "" }, { enabled: !!corps });

  const [instrument, setInstrument] = useState('');
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!mainInstrument || signupInitLoad) {
      return;
    }
    if (!signup) {
      setStatus('Ej svarat');
      setInstrument(mainInstrument.name);
    } else {
      setStatus(signup.status.value);
      setInstrument(signup.instrument.name);
    }
  }, [mainInstrument, signupInitLoad, signup]);

  const loading = !corps || !mainInstrument || signupInitLoad;

  return (
    <Stack spacing={2}>
      <FormLoadingOverlay visible={loading}>
        <SegmentedControl
          disabled={signupRefetching || submitting}
          size="xs"
          value={status}
          fullWidth
          onChange={(s) => {
            if (!s || !corps) {
              return;
            }
            setSubmitting(true);
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
      </FormLoadingOverlay>
    </Stack>
  );
}

export default GigSignupBox;
