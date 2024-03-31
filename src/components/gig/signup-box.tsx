'use client';

import { useEffect, useState } from 'react';
import { trpc } from '../../utils/trpc';
import SegmentedControl from 'components/input/segmented-control';
import Checkbox from 'components/input/checkbox';
import Select from 'components/input/select';
import FormLoadingOverlay from 'components/form-loading-overlay';
import { lang } from 'utils/language';
import { aprilFoolsInstrumentLabel, isAprilFools } from 'utils/date';
import Wheel from 'components/wheel';

type Signup = {
  status: { value: string };
  instrument: { name: string };
  checkbox1: boolean;
  checkbox2: boolean;
};

interface GigSignupBoxProps {
  gigId: string;
  checkbox1: string;
  checkbox2: string;
  signup?: Signup;
}

const SIGNUP_OPTIONS = [
  { label: lang('Ja', 'Yes'), value: 'Ja', color: 'green' },
  { label: lang('Nej', 'No'), value: 'Nej', color: 'var(--corps-red)' },
  { label: lang('Kanske', 'Maybe'), value: 'Kanske', color: 'orange' },
];

const GigSignupBox = ({
  gigId,
  checkbox1,
  checkbox2,
  signup,
}: GigSignupBoxProps) => {
  const utils = trpc.useUtils();

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
  const { data: mainInstrument } = trpc.corps.getMainInstrument.useQuery();

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
    if (!mainInstrument) {
      return;
    }
    if (!signup) {
      setInstrument(mainInstrument.name);
    } else {
      setStatus(signup.status.value);
      setInstrument(signup.instrument.name);
      setCheckbox1Checked(signup.checkbox1);
      setCheckbox2Checked(signup.checkbox2);
    }
  }, [mainInstrument, signup]);

  const loading = !corps || !mainInstrument;

  const handleSignupStatusChange = (value: string) => {
    if (!value || !corps) {
      return;
    }
    setSubmitting(true);
    setStatus(value);
    addSignup.mutate({
      gigId,
      corpsId: corps.id,
      status: value,
      instrument,
      checkbox1: checkbox1Checked,
      checkbox2: checkbox2Checked,
    });
  };

  const handleInstrumentChange = (value: string) => {
    if (!value || !corps) {
      return;
    }
    setSubmitting(true);
    setInstrument(value);
    addSignup.mutate({
      gigId,
      corpsId: corps.id,
      status: status,
      instrument: value,
      checkbox1: checkbox1Checked,
      checkbox2: checkbox2Checked,
    });
  };

  return (
    <FormLoadingOverlay showSpinner={false} visible={submitting || loading}>
      <div className='flex flex-col gap-2'>
        {isAprilFools() ? (
          <Wheel
            options={SIGNUP_OPTIONS}
            onChange={handleSignupStatusChange}
            value={status}
          />
        ) : (
          <SegmentedControl
            defaultValue={signup?.status.value ?? ''}
            onChange={(v) => handleSignupStatusChange(v.toString())}
            options={SIGNUP_OPTIONS}
          />
        )}
        {checkbox1 && (
          <Checkbox
            checked={checkbox1Checked}
            label={checkbox1}
            onChange={(e) => {
              if (!corps) {
                return;
              }
              setSubmitting(true);
              setCheckbox1Checked(e.currentTarget.checked);
              addSignup.mutate({
                gigId,
                corpsId: corps.id,
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
              if (!corps) {
                return;
              }
              setSubmitting(true);
              setCheckbox2Checked(e.currentTarget.checked);
              addSignup.mutateAsync({
                gigId,
                corpsId: corps.id,
                status,
                instrument,
                checkbox1: checkbox1Checked,
                checkbox2: e.currentTarget.checked,
              });
            }}
          />
        )}
        {(corps?.instruments.length ?? 0) > 1 &&
          (isAprilFools() ? (
            <Wheel
              options={
                corps?.instruments.map((i) => ({
                  label: aprilFoolsInstrumentLabel(i.instrument.name),
                  value: i.instrument.name,
                })) ?? []
              }
              onChange={handleInstrumentChange}
              value={instrument}
            />
          ) : (
            <Select
              label='Instrument'
              value={instrument}
              onChange={handleInstrumentChange}
              options={
                corps?.instruments.map((i) => ({
                  label: i.instrument.name,
                  value: i.instrument.name,
                })) ?? []
              }
            />
          ))}
      </div>
    </FormLoadingOverlay>
  );
};

export default GigSignupBox;
