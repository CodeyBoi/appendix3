'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from './input/button';
import { IconLogout } from '@tabler/icons-react';
import { lang } from 'utils/language';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <Button
      color='navbutton'
      className='flex justify-start transition-colors hover:bg-red-600'
      onClick={handleSignOut}
      fullWidth
    >
      <IconLogout />
      {lang('Logga ut', 'Sign out')}
    </Button>
  );
};

export default SignOutButton;
