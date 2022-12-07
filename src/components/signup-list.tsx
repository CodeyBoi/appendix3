import React, { useMemo, useState } from "react";
import {
  Box,
  Center,
  Table,
  Checkbox,
  CloseButton,
  Tooltip,
  Title,
  Button,
  Group,
  Space,
} from "@mantine/core";
import { trpc } from "../utils/trpc";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons";
import { useQueryClient } from "@tanstack/react-query";
import MultiSelectCorpsii from "./multi-select-corpsii";
import Loading from "./loading";

interface SignupListProps {
  gigId: string;
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

const SignupList = ({ gigId }: SignupListProps) => {
  const queryClient = useQueryClient();
  const utils = trpc.useContext();

  const { data: signups, isInitialLoading: signupsLoading } = trpc.gig.getSignups.useQuery(
    { gigId },
    { enabled: !!gigId }
  );

  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === "admin";

  const { data: instruments } = trpc.instrument.getAll.useQuery();
  // An object which maps instrument names to their position in the INSTRUMENTS array
  const instrumentPrecedence: { [key: string]: number } = useMemo(
    () =>
      instruments?.reduce((acc, instrument) => {
        (acc as { [key: string]: number })[instrument.name] = instrument.id;
        return acc;
      }, {}) ?? [],
    [instruments]
  );

  // Sorts the list of corpsii by instrument precedence, then number, then last name, then first name.
  const signupsSorted = useMemo(
    () =>
      signups?.sort((a, b) => {
        // Compare instrument precedence
        if (a.instrument !== b.instrument) {
          const aPrio = instrumentPrecedence[a.instrument] ?? Infinity;
          const bPrio = instrumentPrecedence[b.instrument] ?? Infinity;
          return aPrio - bPrio;
        }

        // Compare numbers
        if (a.number || b.number) {
          return (a.number || Infinity) - (b.number || Infinity);
        }

        // Compare last name
        if (a.lastName !== b.lastName) {
          return a.lastName.localeCompare(b.lastName);
        }

        // Compare first name
        return a.firstName.localeCompare(b.firstName);
      }) ?? [],
    [signups, instrumentPrecedence]
  );

  // Divide the list of corpsii into people who answered yes and people who answered maybe
  const splitList = signupsSorted?.reduce(
    (acc, signup) => {
      if (signup.signupStatus === "Ja") {
        acc.yesList.push(signup);
      } else if (signup.signupStatus === "Kanske") {
        acc.maybeList.push(signup);
      }
      return acc;
    },
    {
      yesList: [] as typeof signupsSorted,
      maybeList: [] as typeof signupsSorted,
    }
  );

  const yesList = splitList?.yesList;
  const maybeList = splitList?.maybeList;

  const form = useForm({
    initialValues: { corpsIds: [] as string[] },
    validate: {
      corpsIds: (value) =>
        value.length > 0 ? null : "Du måste välja minst ett corps",
    },
  });

  const addSignups = trpc.gig.addSignups.useMutation({
    onMutate: async () => {
      form.reset();
    },
    onSettled: () => {
      queryClient.invalidateQueries([["gig", "getSignups"], { gigId }]);
    },
  });

  const editAttendance = trpc.gig.editAttendance.useMutation();

  const removeSignup = trpc.gig.removeSignup.useMutation({
    onSuccess: async () => {
      await utils.gig.getSignup.invalidate();
      await utils.gig.getSignups.invalidate();
    },
  });

  const handleDelete = (corpsId: string) => {
    if (window.confirm("Är du säker på att du vill ta bort anmälningen?")) {
      removeSignup.mutateAsync({ corpsId, gigId });
    }
  };

  /** Code from here on is absolutely horrible, but it works.
   *  Travelers beware.
   */

  const signupsToTable = (signups: typeof signupsSorted) => {
    if (signups.length === 0) {
      return;
    }
    return (
      <tbody>
        {signups.map((signup) => {
          return (
            <tr key={signup.corpsId}>
              <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                {signup.instrument}
              </td>
              <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                {signup.number ?? "p.e."}
              </td>
              <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                {signup.firstName + " " + signup.lastName}
              </td>
              {isAdmin && (
                <>
                  <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Center>
                      <Checkbox
                        styles={{ root: { display: "flex" } }}
                        defaultChecked={signup.attended}
                        onChange={(event) =>
                          editAttendance.mutateAsync({
                            gigId,
                            corpsId: signup.corpsId,
                            attended: event.target.checked,
                          })
                        }
                      />
                    </Center>
                  </td>
                  <td style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <Center>
                      <Tooltip label="Ta bort anmälan">
                        <CloseButton
                          color="red"
                          onClick={() => handleDelete(signup.corpsId)}
                        />
                      </Tooltip>
                    </Center>
                  </td>
                </>
              )}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const yesTable = signupsToTable(yesList);
  const maybeTable = signupsToTable(maybeList);

  return (
    <Box>
      {isAdmin && (
        <form
          onSubmit={form.onSubmit((values) =>
            addSignups.mutateAsync({
              corpsIds: values.corpsIds,
              gigId,
              status: "Ja",
            })
          )}
        >
          <Space h="sm" />
          <Group position="apart" noWrap>
            <MultiSelectCorpsii
              placeholder="Lägg till anmälningar..."
              limit={30}
              maxDropdownHeight={350}
              icon={<IconUser />}
              filter={(_value, selected, item) =>
                !selected &&
                (!signups || !signups.some((s) => s.corpsId === item.value))
              }
              {...form.getInputProps("corpsIds")}
            />
            <Button type="submit">Lägg till anmälan</Button>
          </Group>
        </form>
      )}
      <Space h="sm" />
      {signupsLoading && <Loading msg="Laddar anmälningar..." />}
      {!signupsLoading && (
        <>
          {yesList.length === 0 ? (
            <Title order={3}>
              <i>Ingen är anmäld än. Kanske kan du bli den första?</i>
            </Title>
          ) : (
            <>
              <Title order={3}>Dessa är anmälda:</Title>
              <Table sx={{ tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th>Instrument</th>
                    <th>Nummer</th>
                    <th>Namn</th>
                    {isAdmin && (
                      <th>
                        <Center>Närvaro</Center>
                      </th>
                    )}
                    {isAdmin && <th></th>}
                  </tr>
                </thead>
                {yesTable}
              </Table>
            </>
          )}
        </>
      )}
      <br />
      {maybeList && maybeList.length > 0 && (
        <>
          <Title order={3}>Dessa kanske kommer:</Title>
          <Table sx={{ tableLayout: "fixed" }}>
            <thead>
              <tr>
                <th>Instrument</th>
                <th>Nummer</th>
                <th>Namn</th>
                {isAdmin && <th>Närvaro</th>}
              </tr>
            </thead>
            {maybeTable}
          </Table>
        </>
      )}
    </Box>
  );
};

export default SignupList;
