'use client';

import { IconLogout } from '@tabler/icons';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Button from './input/button';

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <Button
      color='navbutton'
      className='flex justify-start w-full transition-colors hover:bg-red-600'
      onClick={handleSignOut}
    >
      <IconLogout />
      Logga ut
    </Button>
  );
};

export default SignOutButton;