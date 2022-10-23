import { Button, Menu, useMantineColorScheme } from "@mantine/core";
import React, { useMemo } from "react";
import { IconFilePlus, IconSettings, IconLockOpen, IconUserPlus } from "@tabler/icons";
import Link from "next/link";

interface AdminMenuProps {
  permissions: Set<string>;
}

const AdminMenu = ({ permissions }: AdminMenuProps) => {

  const { colorScheme } = useMantineColorScheme();

  const canManageCorps = useMemo(() => permissions.has('ManageCorps'), [permissions]);
  const canManageGig = useMemo(() => permissions.has('ManageGig'), [permissions]);
  const canManagePermissions = useMemo(() => permissions.has('ManagePermissions'), [permissions]);

  return (
    <Menu shadow="md" width={200}>
      <Menu.Target>
        <Button compact leftIcon={<IconSettings />}>Administration</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {(canManageCorps || canManagePermissions) && <Menu.Label>Användare</Menu.Label>}
        {canManageCorps &&
          <Menu.Item
            icon={<IconUserPlus />}
            component={Link}
            href="/admin/register"
          >
            Skapa användare
          </Menu.Item>}
        {canManagePermissions && <Menu.Item icon={<IconLockOpen />} component={Link} href="/admin/permissions">Hantera behörigheter</Menu.Item>}
        {(canManageGig || canManagePermissions) && <Menu.Divider />}
        {(canManageGig) && <Menu.Label>Spelningar</Menu.Label>}
        {(canManageGig) && <Menu.Item icon={<IconFilePlus />} component={Link} href="/admin/gig/new">Skapa spelning</Menu.Item>}
      </Menu.Dropdown>
    </Menu>
  );
}

export default AdminMenu;
