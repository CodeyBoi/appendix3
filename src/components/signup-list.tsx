import React, { useMemo } from "react";
import { Box, Center, Table, Checkbox, CloseButton } from "@mantine/core";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import CONSTANTS from '../src/constants.mjs';
import { useQueryClient } from "@tanstack/react-query";
const { INSTRUMENTS }: { INSTRUMENTS: string[] } = CONSTANTS;

export interface SignupInfo {
  corpsId: number;
  firstName: string;
  lastName: string;
  number?: number;
  instrument: string;
  status: string;
  attended: boolean;
}

interface SignupListProps {
  signups: SignupInfo[];
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

// An object which maps instrument names to their position in the INSTRUMENTS array
const instrumentPrecedence: { [key: string]: number } = INSTRUMENTS.reduce((acc, instrument, index) => {
  (acc as { [key: string]: number })[instrument] = index;
  return acc;
}, {});

const SignupList = ({ signups, isAdmin, gigId }: SignupListProps) => {

  const queryClient = useQueryClient();

  /** Code from here on is absolutely horrible, but it works. 
   *  Travelers beware. */

  // Sorts the list of corpsii by instrument precedence, then number, then last name, then first name.
  const signupsSorted = useMemo(() => signups.sort((a, b) => {
    if (a.instrument === b.instrument) {
      if (!a.number && !b.number) {
        if (a.lastName === b.lastName) {
          return a.firstName.localeCompare(b.firstName);
        } else {
          return a.lastName.localeCompare(b.lastName);
        }
      } else {
        return (a.number || Infinity) - (b.number || Infinity);
      }
    } else {
      return instrumentPrecedence[a.instrument] - instrumentPrecedence[b.instrument];
    }
  }), [signups]);

  if (signups.length === 0) {
    return null;
  }

  const signupsToTable = (signups: SignupInfo[]) => {
    if (signups.length === 0) {
      return;
    }

    return (
      <tbody>
        {signups.map((signup) => {
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
                        onChange={(event) => {
                          const attended = event.target.checked;
                          fetch(`http://localhost:5160/api/signup`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ corpsId: signup.corpsId, gigId, attended }),
                          })
                            .then(res => res.json())
                            .catch(err => console.log(err));
                        }} />
                    </Center>
                  </td>
                  <td style={{ border: 0, padding: 0 }}>
                    <Center>
                      <CloseButton
                        color="red"
                        onClick={async () => {
                          await fetch(`http://localhost:5160/api/signup`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ corpsId: signup.corpsId, gigId }),
                          });
                          queryClient.invalidateQueries(['signup']);

                        }}
                      />
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

  return (
    <Box>
      <Table>
        <thead>
          <tr>
            <th>Instrument</th>
            <th><Center>Nummer</Center></th>
            <th>Namn</th>
            {isAdmin && <th><Center>Närvaro</Center></th>}
          </tr>
        </thead>
        {/* <Space h="xs" /> */}
        {signupsToTable(signupsSorted)}
      </Table>
    </Box>
  );
}

export default SignupList;