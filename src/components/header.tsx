import React from "react";
import { Header, Group, Button } from "@mantine/core";
import Logo from "./logo";
import AdminMenu from "./admin-menu";
import { IconLogout, IconUser } from "@tabler/icons";
import { signOut, useSession } from "next-auth/react";
import { NextLink } from "@mantine/next";

const AppendixHeader = () => {
  const { data: session } = useSession();
  const isAdmin = session?.user?.corps?.role?.name === "admin";

  return (
    <Header
      height={60}
      p="sm"
      sx={(theme) => ({
        backgroundColor: theme?.colors?.red?.[5],
        color: theme.white,
        zIndex: 516,
      })}
    >
      <Group position="apart">
        <Logo />
        <Group spacing={0}>
          {isAdmin && <AdminMenu />}
          <Button
            px={6}
            leftIcon={<IconLogout />}
            size="sm"
            onClick={() => signOut()}
          >
            Logga ut
          </Button>
        </Group>
      </Group>
    </Header>
  );
};

export default AppendixHeader;
