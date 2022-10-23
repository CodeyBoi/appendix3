import React from "react";
import { ActionIcon, Button, Center, Group, Stack, Tooltip, useMantineTheme } from "@mantine/core";
import { IconUser, IconEdit } from "@tabler/icons";
// import { Corps, Gig } from "../src/types/common/main";
import GigSignupBox from "./signup-box";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Gig } from "@prisma/client";
import { NextLink } from "@mantine/next";

interface GigButtonsProps {
  gig: Gig;
}

const GigButtons = ({ gig }: GigButtonsProps) => {

  const theme = useMantineTheme();

  const router = useRouter();
  const pathname = router.pathname;

  const currentDate = dayjs();
  const gigDate = dayjs(gig.date);
  const showSignup =
    // Today is before the gig date
    currentDate.subtract(1, 'day').isBefore(gigDate)
    // There is no signup start date or today is after or at the signup start date
    && (!gig.signupStart || currentDate.add(1, 'day').isAfter(dayjs(gig.signupStart)))
    // There is no signup end date or today is before or at the signup end date
    && (!gig.signupEnd || currentDate.subtract(1, 'day').isBefore(dayjs(gig.signupEnd)));

  const isAdmin = false;

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
              <IconUser size={20} />
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
              href={`/gig/${gig.id}/edit`}
            >
              <IconEdit size={20} />
            </ActionIcon>
          </Tooltip>
        }
      </Stack>
      {showSignup && <GigSignupBox gigId={gig.id} />}
    </Group>
  );
}

export default GigButtons;


