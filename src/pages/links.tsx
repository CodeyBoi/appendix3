import React from 'react';
import { Text, Title } from '@mantine/core';

const style = {
  color: 'blue',
  textDecoration: 'underline',
  cursor: 'pointer',
};

const Links = () => {
  return (
    <div>
      <Title order={2}>Länkar</Title>
      <Text mt={12}>
        <ul>
          <li>
            <a style={style} href='https://www.bleckhornen.org/'>
              Bleckhornens publika hemsida
            </a>
          </li>
          <li>
            <a style={style} href='https://www.wiki.bleckhornen.org/'>
              Bleckhornswikin
            </a>
          </li>
          <li>
            <a
              style={style}
              href='https://www.facebook.com/groups/342920649132131'
            >
              Facebook-Tarmen
            </a>
          </li>
        </ul>
      </Text>
    </div>
  );
};

export default Links;
