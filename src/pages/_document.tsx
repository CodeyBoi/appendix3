import { createStylesServer, ServerStyles } from '@mantine/next';
import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document';

const stylesServer = createStylesServer();

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles
          html={initialProps.html}
          server={stylesServer}
          key='styles'
        />,
      ],
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
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1, viewport-fit=cover'
          />
          <meta name='apple-mobile-web-app-capable' content='yes' />
          <meta
            name='theme-color'
            content='#ce0c00'
            media='(prefers-color-scheme: dark)'
          ></meta>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
