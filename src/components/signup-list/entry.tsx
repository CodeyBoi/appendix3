import { Center, Checkbox, Tooltip, CloseButton } from "@mantine/core";
import React from "react";

interface SignupEntryProps {
  signup: {
    corpsId: string;
    instrument: string;
    number?: number;
    firstName: string;
    lastName: string;
    attended: boolean;
  };
  isAdmin?: boolean;
  setAttendance: (attended: boolean) => void;
  handleDelete: () => void;
}

const Entry = ({
  signup,
  isAdmin = false,
  setAttendance,
  handleDelete,
}: SignupEntryProps) => {
  const tdStyle = {
    paddingTop: 0,
    paddingBottom: 0,
    borderBottom: isAdmin ? undefined : 0,
  };
  const name = `${signup.number ? "#" + signup.number.toString() : "p.e."} ${
    signup.firstName
  } ${signup.lastName}`;

  return (
    <>
      <td style={{ ...tdStyle, width: "40px" }}>{signup.instrument}</td>
      <td style={{ ...tdStyle, whiteSpace: isAdmin ? "break-spaces" : "nowrap" }}>{name}</td>
      {isAdmin && (
        <>
          <td style={tdStyle}>
            <Center>
              <Checkbox
                styles={{ root: { display: "flex" } }}
                defaultChecked={signup.attended}
                onChange={(event) => setAttendance(event.target.checked)}
              />
            </Center>
          </td>
          <td style={tdStyle}>
            <Center>
              <Tooltip label="Ta bort anmälan">
                <CloseButton color="red" onClick={handleDelete} />
              </Tooltip>
            </Center>
          </td>
        </>
      )}
    </>
  );
};

export default Entry;
