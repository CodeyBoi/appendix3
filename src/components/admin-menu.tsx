import { Button, Menu } from "@mantine/core";
import React from "react";
import {
  IconFilePlus,
  IconSettings,
  IconUser,
  IconUserPlus,
} from "@tabler/icons";
import { NextLink } from "@mantine/next";

const AdminMenu = () => {
  return (
    <Menu shadow="md">
      <Menu.Target>
        <Button px={6} leftIcon={<IconSettings />}>
          Administration
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Corpsii</Menu.Label>
        <Menu.Item
          icon={<IconUserPlus />}
          component={NextLink}
          href="/admin/corps/new"
        >
          Skapa corpsmedlem
        </Menu.Item>
        <Menu.Item
          icon={<IconUser />}
          component={NextLink}
          href="/admin/corps"
        >
          Visa/uppdatera corpsmedlemmar
        </Menu.Item>
        <Menu.Divider />
        <Menu.Label>Spelningar</Menu.Label>
        <Menu.Item
          icon={<IconFilePlus />}
          component={NextLink}
          href="/admin/gig/new"
        >
          Skapa spelning
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AdminMenu;
