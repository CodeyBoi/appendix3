import { Metadata } from 'next';
import { lang } from 'utils/language';

export const metadata: Metadata = {
  title: 'Länkar',
};

const Links = () => {
  const style = {
    color: `#ce0c00`,
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  return (
    <div>
      <h1>{lang('Länkar', 'Links')}</h1>
      <div className='text-lg'>
        <ul className='list-disc pl-4'>
          <li>
            <a style={style} href='https://www.bleckhornen.org/'>
              {lang(
                'Bleckhornens publika hemsida',
                "Bleckhornen's public website",
              )}
            </a>
          </li>
          <li>
            <a style={style} href='https://www.wiki.bleckhornen.org/'>
              {lang('Bleckhornswikin', 'The Bleckhorn Wiki')}
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
              {lang(
                'Bleckhornens discordserver',
                'The Bleckhorn Discord Server',
              )}
            </a>
          </li>
          <li>
            <a
              style={style}
              href='http://old.bleckhornen.org/appendix/minnesfond/'
            >
              {lang('Minnesfonden', 'The Memorial Fund')}
            </a>
          </li>
          <li>
            <a style={style} href='https://www.youtube.com/watch?v=a3Z7zEc7AXQ'>
              {lang(
                'Nakenbilder av Arvid Tarmén',
                'Nude pictures of Arvid Tarmén',
              )}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Links;
