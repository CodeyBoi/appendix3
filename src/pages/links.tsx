import Head from 'next/head';

const Links = () => {
  const style = {
    color: `#ce0c00`,
    textDecoration: 'underline',
    cursor: 'pointer',
  };
  return (
    <div>
      <Head>
        <title>Länkar</title>
      </Head>
      <h1>Länkar</h1>
      <div className='text-lg'>
        <ul className='pl-4 list-disc'>
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
            <a
              style={style}
              href='http://old.bleckhornen.org/appendix/minnesfond/'
            >
              Fonden
            </a>
          </li>
          <li>
            <a style={style} href='https://www.youtube.com/watch?v=a3Z7zEc7AXQ'>
              Nakenbilder av Arvid Tarmén
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Links;
