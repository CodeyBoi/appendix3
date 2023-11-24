import { api } from 'trpc/server';
import { lang } from 'utils/language';
import AdminPermissionList from './permission-list';

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
      <AdminPermissionList role={role} />
    </div>
  );
};

export default AdminEditPermissionsPage;
