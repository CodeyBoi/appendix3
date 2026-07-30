import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { ReactElement } from 'react';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import AppShell from 'app/app-shell';

const AuthenticatedLayout = async ({
  children,
}: {
  children: ReactElement;
}) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  return (
    <AppShell>
      <main className='p-3 lg:ml-72 lg:p-6'>{children}</main>
    </AppShell>
  );
};

export default AuthenticatedLayout;
