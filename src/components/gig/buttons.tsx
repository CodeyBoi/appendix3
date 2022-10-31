import React from "react";
import { ActionIcon, Button, Center, Group, Stack, Tooltip, useMantineTheme } from "@mantine/core";
import { IconUser, IconEdit } from "@tabler/icons";
// import { Corps, Gig } from "../src/types/common/main";
import GigSignupBox from "./signup-box";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Gig } from "@prisma/client";
import { NextLink } from "@mantine/next";
import { trpc } from "../../utils/trpc";

interface GigButtonsProps {
  gig: Gig;
}

const GigButtons = ({ gig }: GigButtonsProps) => {

  const theme = useMantineTheme();

  const router = useRouter();
  const pathname = router.pathname;

  const { data: role } = trpc.corps.getRole.useQuery();

  const currentDate = dayjs().startOf('day');
  const gigDate = dayjs(gig.date);
  const showSignup =
    // Today is before the gig date
    currentDate.subtract(1, 'day').isBefore(gigDate)
    // There is no signup start date or today is after or at the signup start date
    && (!gig.signupStart || currentDate.add(1, 'day').isAfter(dayjs(gig.signupStart).startOf('day')))
    // There is no signup end date or today is before or at the signup end date
    && (!gig.signupEnd || currentDate.subtract(1, 'day').isBefore(dayjs(gig.signupEnd).startOf('day')));

  const isAdmin = role === "Admin";

  return (
    <Group align="start" pl={12} pb={6} spacing={20}>
      <Stack spacing={0}>
        {/* Only show this button if the user isn't at the `/gig/:id/signups` page */}
        {!pathname.endsWith("/signups") && (
          <Tooltip label="Visa anmälningar">
            <ActionIcon
              size={30}
              mt={25}
              sx={{ color: theme.colors.red[5], borderColor: theme.colors.gray[4] }}
              variant="outline"
              component={NextLink}
              href={`/gig/${gig.id}`}
            >
              <IconUser />
            </ActionIcon>
          </Tooltip>
        )}
        {isAdmin &&
          <Tooltip label="Redigera spelning">
            <ActionIcon
              size={30}
              mt={27}
              sx={{ color: theme.colors.red[5], borderColor: theme.colors.gray[4] }}
              variant="outline"
              component={NextLink}
              href={`/gig/edit/${gig.id}`}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
        }
      </Stack>
      {showSignup && <GigSignupBox gigId={gig.id} />}
    </Group>
  );
}

export default GigButtons;


