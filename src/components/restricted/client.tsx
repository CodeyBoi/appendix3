'use client';

import { api } from 'trpc/react';
import { Permission } from 'utils/permission';

type RestrictedProps = {
  permissions: Permission[] | Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

const Restricted = (props: RestrictedProps) => {
  const { data: userPermissions } = api.permission.getOwnPermissions.useQuery();
  const requiredPermissions = Array.isArray(props.permissions)
    ? props.permissions
    : [props.permissions];
  const hasPermissions =
    userPermissions && requiredPermissions.every((p) => userPermissions.has(p));

  if (!hasPermissions) {
    return props.fallback ?? null;
  }

  return props.children;
};

export default Restricted;
