import React from "react";
import {
  ActionIcon,
  Group,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import { IconUser, IconEdit } from "@tabler/icons";
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

  const currentDate = dayjs().startOf("day");
  const showSignup =
    // Today is before the gig date
    currentDate.subtract(1, "day").isBefore(gig.date, "day") &&
    // There is no signup start date or today is after or at the signup start date
    (!gig.signupStart ||
      currentDate.add(1, "day").isAfter(gig.signupStart, "day")) &&
    // There is no signup end date or today is before or at the signup end date
    (!gig.signupEnd ||
      currentDate.subtract(1, "day").isBefore(gig.signupEnd, "day"));

  const isAdmin = role === "admin";

  return (
    <Group align="start" pl={12} pb={6} spacing={20}>
      {showSignup && <GigSignupBox gigId={gig.id} />}
      <Stack spacing={6}>
        {/* Only show this button if the user isn't at the `/gig/:id/signups` page */}
        {!pathname.endsWith("/signups") && (
          <Tooltip label="Visa anmälningar">
            <ActionIcon
              size={30}
              mt={25}
              sx={{
                color: theme.colors.red[5],
                borderColor: theme.colors.gray[4],
              }}
              variant="outline"
              component={NextLink}
              href={`/gig/${gig.id}`}
            >
              <IconUser />
            </ActionIcon>
          </Tooltip>
        )}
        {isAdmin && (
          <Tooltip label="Redigera spelning">
            <ActionIcon
              size={30}
              // mt={27}
              sx={{
                color: theme.colors.red[5],
                borderColor: theme.colors.gray[4],
              }}
              variant="outline"
              component={NextLink}
              href={`/admin/gig/${gig.id}`}
            >
              <IconEdit />
            </ActionIcon>
          </Tooltip>
        )}
      </Stack>
    </Group>
  );
};

export default GigButtons;
