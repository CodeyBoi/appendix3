import { APPENDIX_DEVELOPERS } from 'utils/corps';
import { lang } from 'utils/language';

const About = () => {
  return (
    <div>
      <h2>{lang('Om sidan', 'About')}</h2>
      <div>
        {lang(
          'Denna fruktansvärt coola och välbyggda sida knackades i ',
          'This terribly cool and well-built website was coded in ',
        )}
        <a href='https://nextjs.org/'>Next.js</a>
        {lang(' av följande tappra hjältar:', ' by the following heroes:')}
        <ul className='list-disc py-2 pl-6'>
          {APPENDIX_DEVELOPERS.map((name) => (
            <li>{name}</li>
          ))}
        </ul>
        {lang(
          'Bjud dem gärna på ett streck eller dylikt om ni ser dem i vardagen. Vill man bidra med kod eller design kan man snacka med någon i ITK eller kolla in den publika ',
          'Feel free to offer them a streck or something if you see them around. If you want to contribute with code or design, talk to someone in ITK or check out the public ',
        )}
        <a
          style={{
            color: '#ce0c00',
            textDecoration: 'underline',
            cursor: 'pointer',
          }}
          href='https://github.com/CodeyBoi/appendix3'
        >
          {lang('GitHuben', 'GitHub')}
        </a>
        .
      </div>
    </div>
  );
};

export default About;
