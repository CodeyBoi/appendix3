'use client';

import { api } from 'trpc/react';
import { Permission } from 'utils/permission';

type RestrictedProps = {
  permissions: Permission[] | Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

const Restricted = (props: RestrictedProps) => {
  const permissions = Array.isArray(props.permissions)
    ? props.permissions
    : [props.permissions];
  const { data: userPermissions } = api.permission.getOwnPermissions.useQuery();
  const hasPermissions =
    userPermissions && permissions.some((p) => userPermissions.has(p));

  if (!hasPermissions) {
    return props.fallback ?? null;
  }

  return props.children;
};

export default Restricted;
