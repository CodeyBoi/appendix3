import { useMantineTheme } from '@mantine/core';

const About = () => {
  const theme = useMantineTheme();
  return (
    <div>
      <h2>Om sidan</h2>
      <div>
        Denna fruktansvärt coola och välbyggda sida knackades i{' '}
        <a href='https://nextjs.org/'>Next.js</a> av följande tappra hjältar:
        <ul className='py-2 pl-6 list-disc'>
          <li>#516 Hannes Ryberg</li>
          <li>h.m. Hampus Wall</li>
          <li>#580 Hanna Nilsson</li>
          <li>!509 Hugo Rogmark</li>
        </ul>
        Bjud dem gärna på ett streck eller dylikt om ni ser dem i vardagen. Vill
        man bidra med kod eller design kan man snacka med någon i ITK eller
        kolla in den publika{' '}
        <a
          style={{
            color: `${theme.colors[theme.primaryColor ?? 'red']?.[5]}`,
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          href='https://github.com/CodeyBoi/appendix3'
        >
          GitHuben
        </a>
        .
      </div>
    </div>
  );
};

export default About;
