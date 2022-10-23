import React from "react";
import { Button, Center, Group, Skeleton, Stack } from "@mantine/core";
import { IconUser, IconEdit } from "@tabler/icons";
// import { Corps, Gig } from "../src/types/common/main";
import GigSignupBox from "./signup-box";
import AlertError from "../alert-error";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Link from "next/link";
import { Corps, Gig } from "@prisma/client";
import { trpc } from "../../utils/trpc";
import { NextLink } from "@mantine/next";

interface GigButtonsProps {
  gig: Gig;
  // corps: Corps;
}

const GigButtons = ({ gig }: GigButtonsProps) => {

  // const location = useLocation();
  // const pathname = location.pathname;

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

  const { data: corps, status: corpsStatus } = trpc.corps.getCorps.useQuery();
  const { data: signup, status: signupStatus } = trpc.gig.signupStatus.useQuery(
    { gigId: gig.id, corpsId: corps?.id! },
    { enabled: !!corps },
  );

  // const { data: signupValue, status: signupStatus } = useQuery<string>(["signup", gig.id, corps.id], async () => {
  //   const signups = (await axios.get(`/api/signup?gigId=${gig.id}&corpsId=${corps.id}`)).data;
  //   // const response = await fetch(`/api/signup?gigId=${gig.id}&corpsId=${corps.id}`);
  //   // const signups = (await response.json()) as Signup[];
  //   if (signups.length > 0) {
  //     return signups[0].status;
  //   } else {
  //     return "Ej svarat";
  //   }
  // }, {
  //   enabled: showSignup,
  //   staleTime: 1000 * 60 * 60,
  // });

  // const { data: permissions, status: permissionsStatus } = useQuery<Set<string>>(['permissions'], fetchPermissions);
  // const isAdmin = permissions?.has('ManageGig') ?? false;

  // if (permissionsStatus === 'error') {
  //   return <AlertError msg="Kunde inte hämta behörigheter." />;
  // }

  // else if (signupStatus === 'error') {
  //   return <AlertError msg="Kunde inte hämta anmälan." />;
  // }

  // if (signupStatus === 'loading' || permissionsStatus === 'loading') {
  //   return null;
  // }

  const isAdmin = false;
  const signupValue = signup?.status.value;

  return (
    <Center>
      <Group position="right" align="end">
        <Stack spacing={2}>
          {/* Only show this button if the user isn't at the `/gig/:id/signups` page */}
          {!pathname.endsWith("/signups") &&
            <Button
              size="xs"
              compact={isAdmin}
              component={NextLink}
              href={isAdmin ? `/admin/gig/${gig.id}/signups` : `/gig/${gig.id}/signups`}
              leftIcon={<IconUser />}
            >
              Anmälningar
            </Button>
          }
          {isAdmin &&
            <Button
              size="xs"
              compact
              component={NextLink}
              href={`/admin/gig/${gig.id}`}
              leftIcon={<IconEdit />}
            >
              Redigera
            </Button>
          }
        </Stack>
        {showSignup &&
          <GigSignupBox
            gig={gig}
            value={signupValue ?? "Ej svarat"}
          />
        }
      </Group>
    </Center>
  );
}

export default GigButtons;


