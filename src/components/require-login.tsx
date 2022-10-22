import React, { ReactElement } from 'react';
import { useQuery } from '@tanstack/react-query';
import Loading from './loading';
import Login from '../pages/login';
import { Corps } from '../src/types/common/main';
import { fetchCorps } from '../src/utils/fetches';
import useToken from '../src/utils/use-token';
import AlertError from './alert-error';

interface RequireLoginProps {
  element: ReactElement;
  [key: string]: any;
}

const RequireLogin = ({ element }: RequireLoginProps) => {
  const { token } = useToken();

  const { status: corpsStatus } = useQuery<Corps>(['corps'], fetchCorps);

  if (!token) {
    return (
      <Login />
    );
  }

  else if (corpsStatus === 'loading') {
    return <Loading msg="Kollar inloggning..." />;
  }

  else if (corpsStatus === 'error') {
    return (
      <>
        <AlertError msg="Något gick fel med inloggningen. Vänligen försök igen." />
        <Login />
      </>
    );
  }

  return element;
}

export default RequireLogin;
