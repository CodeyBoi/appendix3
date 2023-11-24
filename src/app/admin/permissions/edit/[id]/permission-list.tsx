'use client';

import { IconTrash } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import Button from 'components/input/button';
import Select from 'components/input/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from 'trpc/react';
import { lang } from 'utils/language';
import { ALL_PERMISSIONS, Permission } from 'utils/permission';

type Role = {
  id: number;
  name: string;
  permissions: {
    id: number;
    name: Permission;
  }[];
};

type AdminPermissionListProps = {
  role: Role;
};

const AdminPermissionList = ({ role }: AdminPermissionListProps) => {
  const router = useRouter();
  const [newPermission, setNewPermission] = useState<Permission | null>(null);
  const mutation = api.permission.upsertRole.useMutation({
    onSuccess: router.refresh,
  });
  const permissionNames = role.permissions.map((p) => p.name);

  return (
    <div className='flex max-w-md flex-col'>
      {role.permissions.map((permission) => (
        <div key={permission.id}>
          <div className='flex gap-4'>
            <h5 className='grow'>{permission.name}</h5>
            <ActionIcon
              variant='subtle'
              onClick={async () => {
                if (
                  !confirm('Är du säker på att du vill ta bort behörighet?')
                ) {
                  return;
                }
                const newPermissions = permissionNames.filter(
                  (p) => p !== permission.name,
                );
                await mutation.mutateAsync({
                  id: role.id,
                  name: role.name,
                  permissions: newPermissions,
                });
              }}
            >
              <IconTrash />
            </ActionIcon>
          </div>
        </div>
      ))}
      <form
        className='flex items-end gap-4'
        onSubmit={async (e) => {
          e.preventDefault();
          if (!newPermission) {
            return;
          }
          await mutation.mutateAsync({
            id: role.id,
            name: role.name,
            permissions: [...permissionNames, newPermission],
          });
        }}
      >
        <Select
          label={lang('Lägg till behörighet', 'Add permission')}
          placeholder='Välj behörighet...'
          name='permission'
          className='grow'
          options={ALL_PERMISSIONS.filter(
            (p) => !permissionNames.includes(p),
          ).map((p) => ({
            label: p,
            value: p,
          }))}
          onChange={(p) => setNewPermission(p as Permission)}
        />
        <Button type='submit'>{lang('Lägg till', 'Add')}</Button>
      </form>
    </div>
  );
};

export default AdminPermissionList;
