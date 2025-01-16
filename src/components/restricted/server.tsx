import { api } from 'trpc/server';
import { Permission } from 'utils/permission';

interface RestrictedProps {
  permissions: Permission[] | Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const Restricted = async (props: RestrictedProps) => {
  const permissions = Array.isArray(props.permissions)
    ? props.permissions
    : [props.permissions];
  const userPermissions = await api.permission.getOwnPermissions.query();
  const hasPermissions = permissions.some((p) => userPermissions.has(p));

  if (!hasPermissions) {
    return props.fallback ? <>{props.fallback}</> : null;
  }

  return <>{props.children}</>;
};

export default Restricted;
