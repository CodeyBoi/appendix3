import { Text, Title } from '@mantine/core';
import React from 'react';

const About = () => {
  return (
    <div>
      <Title order={2}>Om sidan</Title>
      <Text mt={12}>
        Denna fruktansvärt coola och välbyggda sida knackades i{' '}
        <a href="https://nextjs.org/">Next.js</a> av följande tappra hjältar:
        <ul>
          <li>#516 Hannes Ryberg</li>
          <li>h.m. Hampus Wall</li>
          <li>p.e. Hanna Nilsson</li>
          <li>!509 Hugo Rogmark</li>
        </ul>
        Bjud dem gärna på ett streck eller dylikt om ni ser dem i vardagen.
        <br />
        <br />
        Vill man bidra med kod eller design kan man snacka med någon i ITK eller kolla in den publika{' '}
        <a style={{
          color: 'blue',
          textDecoration: 'underline',
          cursor: 'pointer',
        }} href="https://github.com/CodeyBoi/appendix3">GitHuben</a>.
      </Text>
    </div>
  );
};

export default About;
