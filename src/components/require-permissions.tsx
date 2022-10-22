import React, { ReactElement, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from './loading';
import { fetchPermissions } from '../src/utils/fetches';
import AlertError from './alert-error';

interface RequirePermissionsProps {
  element?: ReactElement;
  requiredPermissions: Array<string> | string;
}

const RequirePermissions = ({ element, requiredPermissions }: RequirePermissionsProps) => {
  const { data: permissions, status } = useQuery<Set<string>>(['permissions'], fetchPermissions);
  const [output, setOutput] = React.useState<ReactElement>(<Loading msg='Kollar behörigheter...' />);

  const hasPermissions = useMemo(() => {
    const reqPerms = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
    return reqPerms.every((permission) => permissions?.has(permission) ?? false);
  }, [permissions, requiredPermissions]);

  useEffect(() => {
    if (status === 'success') {
      if (hasPermissions) {
        setOutput(<>{element}</>);
      } else {
        setOutput(<AlertError msg="Du har tyvärr inte behörighet att se den här sidan." />);
      }
    } else if (status === 'loading') {
      setOutput(<Loading msg='Kollar behörigheter...' />);
    } else if (status === 'error') {
      setOutput(<AlertError msg='Något gick fel under kontroll av behörigheter.' />);
    }
  }, [status, hasPermissions, element]);

  return output;
}

export default RequirePermissions;
