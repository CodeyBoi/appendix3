import React, { useMemo } from "react";
import { Box, Center, Table, Checkbox, CloseButton, Tooltip, Title, Button, Group, Select, Space } from "@mantine/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useQueryClient } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons";

interface SignupListProps {
  isAdmin: boolean;
  gigId: number;
}

// const STEMS_PER_INSTRUMENT = {
//   Piccolo: 1,
//   Flöjt: 2,
//   Oboe: 1,
//   Klarinett: 3,
//   Fagott: 1,
//   Basklarinett: 1,
//   Sopransaxofon: 1,
//   Altsaxofon: 2,
//   Tenorsaxofon: 1,
//   Barytonsaxofon: 1,
//   Horn: 4,
//   Trumpet: 3,
//   Trombon: 3,
//   Eufonium: 1,
//   Tuba: 1,
//   Slagverk: 3,
//   Fötter: 4,
//   Annat: 0,
// };


const SignupList = ({ isAdmin, gigId }: SignupListProps) => {

  const utils = trpc.useContext();
  const queryClient = useQueryClient();

  const { data: signups, status: signupsStatus } =
    trpc.gig.getSignups.useQuery({ gigId }, { enabled: !!gigId });

  // Divide the list of corpsii into people who answered yes and people who answered maybe
  const splitList = useMemo(() => signups?.reduce((acc, signup) => {
    if (signup.signupStatus === 'Ja') {
      acc.yesList.push(signup);
    } else if (signup.signupStatus === 'Kanske') {
      acc.maybeList.push(signup);
    }
    return acc;
  }, { yesList: [] as typeof signups, maybeList: [] as typeof signups }), [signups]);

  const yesList = splitList?.yesList ?? [];
  const maybeList = splitList?.maybeList ?? [];

  const { data: instruments } = trpc.instrument.getAll.useQuery();
  // An object which maps instrument names to their position in the INSTRUMENTS array
  const instrumentPrecedence: { [key: string]: number } = useMemo(() => instruments?.reduce((acc, instrument) => {
    (acc as { [key: string]: number })[instrument.name] = instrument.id;
    return acc;
  }, {}) ?? [], [instruments]);

  const { data: selectCorpsii, status: selectCorpsiiStatus } = trpc.corps.getCorpsii.useQuery();
  const corpsii = useMemo(() => {
    if (!selectCorpsii) return [];
    return selectCorpsii.map((corps) => ({
      id: corps.id,
      value: corps.id.toString(),
      label: `${corps.number ? '#' + corps.number : 'p.e.'} ${corps.name}`,
    }));
  }, [selectCorpsii]);

  const form = useForm({
    initialValues: { corpsId: '' },
    validate: {
      corpsId: (value) => !!value ? null : 'Du måste välja ett corps',
    }
  });

  const addSignup = trpc.gig.addSignup.useMutation({
    onSuccess: async (_, { corpsId }) => {
      form.setValues({ corpsId: "" });
      await utils.gig.getSignups.invalidate({ gigId });
      await utils.gig.getSignup.invalidate({ gigId, corpsId });
    }
  });

  const removeSignup = trpc.gig.removeSignup.useMutation({
    onSuccess: async () => {
      await utils.gig.getSignup.invalidate();
      await utils.gig.getSignups.invalidate();
    },
  });

  const editAttendance = trpc.gig.editAttendance.useMutation({
    onSuccess: async () => {
      await utils.gig.getSignup.invalidate();
      await utils.gig.getSignups.invalidate();
    },
  });

  /** Code from here on is absolutely horrible, but it works. 
   *  Travelers beware. */

  // Sorts the list of corpsii by instrument precedence, then number, then last name, then first name.
  const signupsSorted = useMemo(() => signups?.sort((a, b) => {
    if (a.instrument === b.instrument) {
      if (!a.number && !b.number) {
        if (a.lastName === b.lastName) {
          return a.firstName.localeCompare(b.firstName);
        } else {
          return a.lastName.localeCompare(b.lastName);
        }
      } else {
        return (a.number ?? Infinity) - (b.number ?? Infinity);
      }
    } else {
      return (instrumentPrecedence[a.instrument] ?? Infinity) - (instrumentPrecedence[b.instrument] ?? Infinity);
    }
  }) ?? [], [signups]);

  const signupsToTable = (signups: any) => {
    if (signups.length === 0) {
      return;
    }

    return (
      <tbody>
        {signups.map((signup: any) => {
          return (
            <tr key={signup.corpsId}>
              <td style={{ border: 0, padding: 0 }}>{signup.instrument}</td>
              <td style={{ border: 0, padding: 0 }}><Center>{signup.number ?? 'p.e.'}</Center></td>
              <td style={{ border: 0, padding: 0 }}>{signup.firstName + ' ' + signup.lastName}</td>
              {isAdmin &&
                <>
                  <td style={{ border: 0, padding: 0 }}>
                    <Center>
                      <Checkbox
                        defaultChecked={signup.attended}
                        onChange={(event) => editAttendance.mutateAsync({
                          gigId,
                          corpsId: signup.corpsId,
                          attended: event.target.checked
                        })} />
                    </Center>
                  </td>
                  <td style={{ border: 0, padding: 0 }}>
                    <Center>
                      <Tooltip label="Ta bort anmälan">
                        <CloseButton
                          color="red"
                          onClick={async () => removeSignup.mutateAsync({
                            gigId,
                            corpsId: signup.corpsId
                          })}
                        />
                      </Tooltip>
                    </Center>
                  </td>
                </>
              }
            </tr>
          );
        })}
      </tbody>
    );
  }

  const yesTable = useMemo(() => signupsToTable(yesList), [yesList]);
  const maybeTable = useMemo(() => signupsToTable(maybeList), [maybeList]);

  if (!signups || signups.length === 0) {
    return null;
  }

  return (
    <Box>
      {isAdmin &&
        <form onSubmit={form.onSubmit((values) => addSignup.mutateAsync({ corpsId: parseInt(values.corpsId), gigId, status: 'Ja' }))}>
          <Space h="sm" />
          <Group position='apart'>
            <Select
              placeholder='Lägg till anmälning...'
              searchable
              limit={30}
              maxDropdownHeight={350}
              data={corpsii?.filter((corps) => !signups?.some((signup) => signup.corpsId === corps.id))}
              nothingFound="Inget corps hittades"
              clearable
              icon={<IconUser />}
              {...form.getInputProps('corpsId')}
            />
            <Button type="submit">Lägg till anmälan</Button>
          </Group>
        </form>
      }
      <Space h="sm" />
      <Title order={3}>{yesList.length > 0 ? 'Dessa är anmälda:' : <i>Ingen är anmäld än. Kanske kan du bli den första?</i>}</Title>
      {yesList.length > 0 &&(
      <Table sx={{ tableLayout: "fixed" }}>
        <thead>
          <tr>
            <th>Instrument</th>
            <th><Center>Nummer</Center></th>
            <th>Namn</th>
            {isAdmin && <th><Center>Närvaro</Center></th>}
          </tr>
        </thead>
        {yesTable}
      </Table>
      )}
      <br />
      {maybeList.length > 0 && (
        <>
          <Title order={3}>Dessa kanske kommer:</Title>
          <Table sx={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th>Instrument</th>
                <th><Center>Nummer</Center></th>
                <th>Namn</th>
                {isAdmin && <th><Center>Närvaro</Center></th>}
              </tr>
            </thead>
            {maybeTable}
          </Table>
        </>
      )}
    </Box>
  );
}

export default SignupList;