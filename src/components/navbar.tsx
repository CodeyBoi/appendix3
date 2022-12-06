import React, { useEffect, useState } from "react";
import {
  Button,
  createStyles,
  Divider,
  Navbar,
  SegmentedControl,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import {
  IconClipboard,
  IconFilePlus,
  IconLogout,
  IconSpeakerphone,
  IconUser,
  IconUserPlus,
} from "@tabler/icons";
import { getOperatingYear } from "../pages/stats/[paramYear]";
import { NextLink } from "@mantine/next";
import { trpc } from "../utils/trpc";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";

interface LinkItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface LinkGroup {
  title?: string;
  links: LinkItem[];
}

type TabLabel = "user" | "admin";

const useStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.colors.red[6],
    border: 0,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  link: {
    ...theme.fn.focusStyles(),
    color: theme.white,
    fontWeight: 500,
    backgroundColor: theme.colors.red[6],

    "&:hover": {
      backgroundColor: theme.colors.red[7],
    },
  },
  activeLink: {
    backgroundColor: theme.colors.red[7],
  },
  control: {
    backgroundColor: theme.colors.red[6],
  },
}));

const tabs: { [key in TabLabel]: LinkGroup[] } = {
  user: [
    {
      links: [
        { label: "Mina sidor", href: "/account", icon: <IconUser /> },
        {
          label: "Statistik",
          href: `/stats/${getOperatingYear()}`,
          icon: <IconClipboard />,
        },
        { label: "Gamla spelningar", href: "/gig", icon: <IconSpeakerphone /> },
      ],
    },
  ],
  admin: [
    {
      title: "Corps",
      links: [
        {
          label: "Skapa corps",
          href: "/admin/corps/new",
          icon: <IconUserPlus />,
        },
        {
          label: "Visa och uppdatera corps",
          href: "/admin/corps",
          icon: <IconUser />,
        },
      ],
    },
    {
      title: "Spelningar",
      links: [
        {
          label: "Skapa spelning",
          href: "/admin/gig/new",
          icon: <IconFilePlus />,
        },
        {
          label: "Visa alla spelningar",
          href: "/admin/gig",
          icon: <IconSpeakerphone />,
        },
      ],
    },
  ],
};

interface NavbarContentProps {
  // Used to close the navbar on mobile when a link is clicked
  onLinkClicked?: (value?: string) => void;
}

const NavbarContent = ({ onLinkClicked }: NavbarContentProps) => {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState("");
  const [activeTab, setActiveTab] = useState<TabLabel>("user");

  const { data: corps } = trpc.corps.getSelf.useQuery();
  const isAdmin = corps?.role?.name === "admin";

  const theme = useMantineTheme();
  const router = useRouter();

  useEffect(() => {
    setActive(router.asPath);
  }, [router.asPath]);

  const links = tabs[activeTab].map((tab) => (
    <Stack key={tab.title} spacing="xs">
      {tab.title && <Divider label={tab.title} color="white" />}
      {tab.links.map((link) => (
        <Button
          key={link.label}
          className={cx(classes.link, {
            [classes.activeLink]: active === link.href,
          })}
          component={NextLink}
          href={link.href}
          onClick={() => {
            setActive(link.href);
            onLinkClicked?.(link.href);
          }}
          leftIcon={link.icon}
          styles={{ inner: { justifyContent: "flex-start" } }}
        >
          {link.label}
        </Button>
      ))}
    </Stack>
  ));

  return (
    <div style={{ height: "100%" }} className={classes.navbar}>
      {isAdmin && (
        <Navbar.Section pt="sm" mx="sm">
          <SegmentedControl
            className={classes.control}
            color={theme.colors.red[6]}
            fullWidth
            value={activeTab}
            onChange={(value: TabLabel) => setActiveTab(value)}
            transitionTimingFunction="ease"
            styles={{
              active: { backgroundColor: theme.colors.red[7] },
              label: {
                color: theme.colors.gray[4],
                ":hover": { color: theme.white },
              },
            }}
            data={[
              { label: "Användare", value: "user" },
              { label: "Admin", value: "admin" },
            ]}
          />
        </Navbar.Section>
      )}
      <Navbar.Section grow pt="sm" mx="sm">
        <Stack>{links}</Stack>
      </Navbar.Section>
      <Navbar.Section pb="sm" mx="sm">
        <Button
          px={6}
          leftIcon={<IconLogout />}
          onClick={() => signOut()}
          className={classes.link}
          styles={{ inner: { justifyContent: "flex-start" } }}
          style={{ width: "100%" }}
        >
          Logga ut
        </Button>
      </Navbar.Section>
    </div>
  );
};

export default NavbarContent;
