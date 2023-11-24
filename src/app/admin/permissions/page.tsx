import { IconEdit } from '@tabler/icons-react';
import ActionIcon from 'components/input/action-icon';
import { api } from 'trpc/server';
import { detailedName } from 'utils/corps';
import { lang } from 'utils/language';

const AdminPermissionsPage = async () => {
  const roles = await api.permission.getRoles.query();
  const corpsPermissions = await api.permission.getCorpsPermissions.query();
  return (
    <div className='flex flex-col gap-4'>
      <h2>{lang('Behörigheter', 'Permissions')}</h2>
      <div className='grid grid-cols-1 gap-y-4 lg:grid-cols-2'>
        <div className='flex flex-col gap-2'>
          <h3>{lang('Behörighetsroller', 'Permission roles')}</h3>
          {roles.map((role) => (
            <div key={role.id}>
              <div className='flex gap-4'>
                <h4>{role.name}</h4>
                <ActionIcon
                  href={`/admin/permissions/edit/${role.id}`}
                  variant='subtle'
                >
                  <IconEdit />
                </ActionIcon>
              </div>
              <ul className='list-disc pl-8'>
                {role.corpsii.map((corps) => (
                  <li key={corps.id}>{detailedName(corps)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-2'>
          <h3>{lang('Corpsbehörigheter', 'Corps permissions')}</h3>
          {corpsPermissions.map((corps) => (
            <div key={corps.id}>
              <h4>{detailedName(corps)}</h4>
              <ul className='list-disc pl-8'>
                {corps.permissions.map((permission) => (
                  <li key={permission.id}>{permission.name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPermissionsPage;
