import { Button, Menu } from "@mantine/core";
import React from "react";
import { IconFilePlus, IconSettings, IconLockOpen, IconUserPlus } from "@tabler/icons";
import { NextLink } from "@mantine/next";

const AdminMenu = () => {

  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button px={6} leftIcon={<IconSettings />}>Administration</Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Användare</Menu.Label>
        <Menu.Item
          icon={<IconUserPlus />}
          component={NextLink}
          href="/register"
        >
          Skapa användare
        </Menu.Item>
        <Menu.Item icon={<IconLockOpen />} component={NextLink} href="/admin/permissions">Hantera behörigheter</Menu.Item>
        <Menu.Divider />
        <Menu.Label>Spelningar</Menu.Label>
        <Menu.Item icon={<IconFilePlus />} component={NextLink} href="/admin/gig/new">Skapa spelning</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

export default AdminMenu;
