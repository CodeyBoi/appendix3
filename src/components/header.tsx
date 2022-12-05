import React, { useState } from "react";
import { Header, Group, Button, Burger, useMantineTheme } from "@mantine/core";
import Logo from "./logo";
import { IconLogout } from "@tabler/icons";
import { signOut } from "next-auth/react";

const AppendixHeader = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const theme = useMantineTheme();

  return (
    <Header
      height={60}
      p="sm"
      sx={(theme) => ({
        backgroundColor: theme?.colors?.red?.[5],
        color: theme.white,
        zIndex: 516,
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.3)",
        border: 0,
      })}
    >
      <Group position="apart">
        <Logo />
        <Group spacing={0}>
          <Button
            px={6}
            leftIcon={<IconLogout />}
            size="sm"
            onClick={() => signOut()}
          >
            Logga ut
          </Button>
          <Burger
            opened={navbarOpen}
            onClick={() => setNavbarOpen(!navbarOpen)}
            title="Open navigation menu"
            sx={(theme) => ({
              color: theme.white,
              [theme.fn.largerThan("sm")]: {
                display: "none",
              },
            })}
          />
        </Group>
      </Group>
    </Header>
  );
};

export default AppendixHeader;
