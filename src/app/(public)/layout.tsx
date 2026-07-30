import AppShell from 'app/app-shell';
import { getServerSession } from 'next-auth';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ReactElement } from 'react';
import { cn } from 'utils/class-names';

const PublicLayout = async ({ children }: { children: ReactElement }) => {
  const session = await getServerSession(authOptions);
  const content = (
    <main className={cn('p-3 lg:p-6', session && 'lg:ml-72')}>{children}</main>
  );

  if (!session) {
    return content;
  }

  return <AppShell>{content}</AppShell>;
};

export default PublicLayout;
