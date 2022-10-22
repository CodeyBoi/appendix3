import React from "react";
import { Button, Center, Group, Stack } from "@mantine/core";
import { PersonIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { Corps, Gig, Signup } from "../src/types/common/main";
import GigSignupBox from "./gig-signup-box";
import { useQuery } from "@tanstack/react-query";
import { fetchPermissions } from "../src/utils/fetches";
import AlertError from "./alert-error";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";

interface GigButtonsProps {
  gig: Gig;
  corps: Corps;
}

const GigButtons = ({ gig, corps }: GigButtonsProps) => {

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

  const { data: signupValue, status: signupStatus } = useQuery<string>(["signup", gig.id, corps.id], async () => {
    const signups = (await axios.get(`/api/signup?gigId=${gig.id}&corpsId=${corps.id}`)).data;
    // const response = await fetch(`/api/signup?gigId=${gig.id}&corpsId=${corps.id}`);
    // const signups = (await response.json()) as Signup[];
    if (signups.length > 0) {
      return signups[0].status;
    } else {
      return "Ej svarat";
    }
  }, {
    enabled: showSignup,
    staleTime: 1000 * 60 * 60,
  });

  const { data: permissions, status: permissionsStatus } = useQuery<Set<string>>(['permissions'], fetchPermissions);
  const isAdmin = permissions?.has('ManageGig') ?? false;

  if (permissionsStatus === 'error') {
    return <AlertError msg="Kunde inte hämta behörigheter." />;
  }

  else if (signupStatus === 'error') {
    return <AlertError msg="Kunde inte hämta anmälan." />;
  }

  if (signupStatus === 'loading' || permissionsStatus === 'loading') {
    return null;
  }

  return (
    <Center>
      <Group position="right" align="end">
        <Stack spacing={2}>
          {/* Only show this button if the user isn't at the `/gig/:id/signups` page */}
          {!pathname.endsWith("/signups") &&
            <Button
              size="xs"
              compact={isAdmin}
              component={Link}
              href={isAdmin ? `/admin/gig/${gig.id}/signups` : `/gig/${gig.id}/signups`}
              leftIcon={<PersonIcon />}
            >
              Anmälningar
            </Button>
          }
          {isAdmin &&
            <Button
              size="xs"
              compact
              component={Link}
              href={`/admin/gig/${gig.id}`}
              leftIcon={<Pencil2Icon />}
            >
              Redigera
            </Button>
          }
        </Stack>
        {showSignup &&
          <GigSignupBox
            gig={gig}
            corps={corps as Corps}
            value={signupValue ?? "Ej svarat"}
          />
        }
      </Group>
    </Center>
  );
}

export default GigButtons;


