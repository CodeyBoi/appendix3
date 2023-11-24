import { IconEdit } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { api } from 'trpc/server';
import { lang } from 'utils/language';

const AdminPermissionsPage = async () => {
  const roles = await api.permission.getRoles.query();
  return (
    <div className='flex flex-col gap-4'>
      <h2>{lang('Behörigheter', 'Permissions')}</h2>
      {roles.map((role) => (
        <div key={role.id}>
          <div className='flex gap-4'>
            <h3>{role.name}</h3>
            <ActionIcon
              href={`/admin/permissions/edit/${role.id}`}
              variant='subtle'
            >
              <IconEdit />
            </ActionIcon>
          </div>
          <ul className='list-disc pl-8'>
            {role.permissions.map((permission) => (
              <li key={permission.id}>{permission.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default AdminPermissionsPage;
