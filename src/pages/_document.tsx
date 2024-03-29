import Document, {
  DocumentContext,
  Head,
  Html,
  NextScript,
} from 'next/document';

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [initialProps.styles],
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet='utf-8' />
          <meta
            name='description'
            content='Ett internt verktyg för alla corps'
          />
          <link rel='manifest' href='/manifest.json' />
          <link
            rel='apple-touch-icon'
            sizes='180x180'
            href='/apple-touch-icon.png'
          />
          <link
            rel='icon'
            type='image/png'
            sizes='32x32'
            href='/favicon-32x32.png'
          />
          <link rel='manifest' href='/site.webmanifest' />
          <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#ce0c00' />
          <meta name='msapplication-TileColor' content='#ce0c00' />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta name='theme-color' content='#B80900'></meta>
        </Head>
        <body>
          <main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
