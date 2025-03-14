'use client';

import { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import SegmentedControl from 'components/input/segmented-control';
import Checkbox from 'components/input/checkbox';
import Select from 'components/input/select';
import FormLoadingOverlay from 'components/form-loading-overlay';
import { aprilFoolsInstrumentLabel, isAprilFools } from 'utils/date';
import Wheel from 'components/wheel';

interface Signup {
  status: { value: string };
  instrument: { name: string };
  checkbox1: boolean;
  checkbox2: boolean;
}

interface Instrument {
  name: string;
  id: number;
}

interface GigSignupBoxProps {
  corpsId: string;
  gigId: string;
  instruments: Instrument[];
  mainInstrument: Instrument;
  checkbox1: string;
  checkbox2: string;
  signup?: Signup;
  signupOptions: {
    label: React.JSX.Element;
    value: string;
    color: string;
  }[];
}

const GigSignupBox = ({
  corpsId,
  gigId,
  instruments,
  mainInstrument,
  checkbox1,
  checkbox2,
  signup,
  signupOptions,
}: GigSignupBoxProps) => {
  const utils = trpc.useUtils();

  const addSignup = trpc.gig.addSignup.useMutation({
    onSuccess: async () => {
      await utils.gig.getSignup.invalidate({ gigId, corpsId });
      await utils.gig.getSignups.invalidate({ gigId });
      setSubmitting(false);
    },
  });

  const [instrument, setInstrument] = useState('');
  const [status, setStatus] = useState(signup?.status.value ?? '');
  const [checkbox1Checked, setCheckbox1Checked] = useState(
    signup?.checkbox1 ?? false,
  );
  const [checkbox2Checked, setCheckbox2Checked] = useState(
    signup?.checkbox2 ?? false,
  );
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!signup) {
      setInstrument(mainInstrument.name);
    } else {
      setStatus(signup.status.value);
      setInstrument(signup.instrument.name);
      setCheckbox1Checked(signup.checkbox1);
      setCheckbox2Checked(signup.checkbox2);
    }
  }, [mainInstrument, signup]);

  const handleSignupStatusChange = (value: string) => {
    if (!value) {
      return;
    }
    setSubmitting(true);
    setStatus(value);
    addSignup.mutate({
      gigId,
      corpsId,
      status: value,
      instrument,
      checkbox1: checkbox1Checked,
      checkbox2: checkbox2Checked,
    });
  };

  const handleInstrumentChange = (value: string) => {
    if (!value) {
      return;
    }
    setSubmitting(true);
    setInstrument(value);
    addSignup.mutate({
      gigId,
      corpsId,
      status: status,
      instrument: value,
      checkbox1: checkbox1Checked,
      checkbox2: checkbox2Checked,
    });
  };

  return (
    <FormLoadingOverlay showSpinner={false} visible={submitting}>
      <div className='flex flex-col gap-2'>
        {isAprilFools() ? (
          <Wheel
            options={signupOptions}
            onChange={handleSignupStatusChange}
            value={status}
          />
        ) : (
          <SegmentedControl
            defaultValue={signup?.status.value ?? ''}
            onChange={(v) => {
              handleSignupStatusChange(v.toString());
            }}
            options={signupOptions}
          />
        )}
        {checkbox1 && (
          <Checkbox
            checked={checkbox1Checked}
            label={checkbox1}
            onChange={(e) => {
              setSubmitting(true);
              setCheckbox1Checked(e.currentTarget.checked);
              addSignup.mutate({
                gigId,
                corpsId,
                status,
                instrument,
                checkbox1: e.currentTarget.checked,
                checkbox2: checkbox2Checked,
              });
            }}
          />
        )}
        {checkbox2 && (
          <Checkbox
            checked={checkbox2Checked}
            label={checkbox2}
            onChange={(e) => {
              setSubmitting(true);
              setCheckbox2Checked(e.currentTarget.checked);
              addSignup.mutate({
                gigId,
                corpsId,
                status,
                instrument,
                checkbox1: checkbox1Checked,
                checkbox2: e.currentTarget.checked,
              });
            }}
          />
        )}
        {instruments.length > 1 &&
          (isAprilFools() ? (
            <Wheel
              options={instruments.map((instrument) => ({
                label: aprilFoolsInstrumentLabel(instrument.name),
                value: instrument.name,
              }))}
              onChange={handleInstrumentChange}
              value={instrument}
            />
          ) : (
            <Select
              label='Instrument'
              value={instrument}
              onChange={handleInstrumentChange}
              options={instruments.map((instrument) => ({
                label: instrument.name,
                value: instrument.name,
              }))}
            />
          ))}
      </div>
    </FormLoadingOverlay>
  );
};

export default GigSignupBox;
