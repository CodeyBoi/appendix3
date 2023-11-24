import { api } from 'trpc/server';
import { lang } from 'utils/language';
import AdminPermissionList from './permission-list';
import AdminRoleHolderList from './roleholder-list';

const AdminEditPermissionsPage = async ({
  params,
}: {
  params: { id: string };
}) => {
  const role = await api.permission.getRole.query({ id: +params.id });

  if (!role) {
    return (
      <div>
        {lang('Behörighetsrollen hittades inte', 'Permission role not found')}
      </div>
    );
  }

  return (
    <div className='flex flex-col gap-2'>
      <h2>{lang('Uppdatera behörighetsroll', 'Update permission role')}</h2>
      <h3>{role.name}</h3>

      <div className='grid grid-cols-1 gap-y-4 lg:grid-cols-2'>
        <div className='flex flex-col'>
          <h4>{lang('Innehavare', 'Holders')}</h4>
          <AdminRoleHolderList role={role} />
        </div>
        <div className='flex flex-col'>
          <h4>{lang('Behörigheter', 'Permissions')}</h4>
          <AdminPermissionList role={role} />
        </div>
      </div>
    </div>
  );
};

export default AdminEditPermissionsPage;
