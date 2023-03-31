import React from 'react';
import { Text } from '@mantine/core';
import { NextLink } from '@mantine/next';

const Logo = () => {
  const date = new Date();
  const isAprilFools = date.getMonth() === 3 && date.getDate() === 1;
  return (
    // <Text
    //   sx={{
    //     fontSize: "1.5rem",
    //     fontFamily: "Castellar",
    //   }}
    //   component={NextLink}
    //   href="/"
    // >Blindtarmen</Text>
    <Text
      sx={{
        fontSize: '1.5rem',
        fontFamily: 'Castellar',
      }}
      component={NextLink}
      href='/'
    >
      {isAprilFools ? 'Bihålan' : 'Blindtarmen'}
    </Text>
  );
};

export default Logo;
