import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';
import { authOptions } from 'pages/api/auth/[...nextauth]';

const AuthenticatedLayout = async ({
  children,
}: {
  children: ReactElement;
}) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return children;
};

export default AuthenticatedLayout;
