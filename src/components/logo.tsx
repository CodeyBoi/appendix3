import React from 'react';
import { Text } from '@mantine/core';
import Link from 'next/link';

const Logo = () => {
  return (
    <Text
      sx={{
        fontSize: '1.5rem',
        fontFamily: 'Castellar',
      }}
      component={Link}
      href='/'
    >
      Blindtarmen
    </Text>
  );
};

export default Logo;
