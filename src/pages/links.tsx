import React from 'react';
import { Text, Title, useMantineTheme } from '@mantine/core';

const Links = () => {
  const theme = useMantineTheme();
  const style = {
    color: `${theme.colors[theme.primaryColor ?? 'red']?.[5]}`,
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  return (
    <div>
      <Title order={1}>Länkar</Title>
      <Text size='lg' mt={12}>
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
          <li>
            <a style={style} href='https://discord.gg/2wZafpfqR3'>
              Bleckhornens discordserver
            </a>
          </li>
          <li>
            <a style={style} href='https://www.youtube.com/watch?v=dQw4w9WgXcQ'>
              Nakenbilder av Arvid Tarmén
            </a>
          </li>
        </ul>
      </Text>
    </div>
  );
};

export default Links;
