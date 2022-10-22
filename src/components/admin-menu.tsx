import { Button, Indicator, Menu, useMantineColorScheme } from "@mantine/core";
import React, { useMemo } from "react";
import { FilePlusIcon, GearIcon, LockOpen1Icon, PersonIcon, PlusIcon } from "@radix-ui/react-icons";
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
        <Button compact leftIcon={<GearIcon />}>Administration</Button>
      </Menu.Target>

      <Menu.Dropdown>
        {(canManageCorps || canManagePermissions) && <Menu.Label>Användare</Menu.Label>}
        {canManageCorps &&
          <Menu.Item
            icon={
              <Indicator
                label={<PlusIcon width={12} />}
                styles={{
                  indicator: {
                    color: colorScheme === 'dark' ? 'white' : 'black',
                    backgroundColor: "transparent",
                  }
                }}
              >
                <PersonIcon />
              </Indicator>}
            component={Link}
            href="/admin/register"
          >
            Skapa användare
          </Menu.Item>}
        {canManagePermissions && <Menu.Item icon={<LockOpen1Icon />} component={Link} href="/admin/permissions">Hantera behörigheter</Menu.Item>}
        {(canManageGig || canManagePermissions) && <Menu.Divider />}
        {(canManageGig) && <Menu.Label>Spelningar</Menu.Label>}
        {(canManageGig) && <Menu.Item icon={<FilePlusIcon />} component={Link} href="/admin/gig/new">Skapa spelning</Menu.Item>}
      </Menu.Dropdown>
    </Menu>
  );
}

export default AdminMenu;
