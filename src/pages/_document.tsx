import { createStylesServer, ServerStyles } from '@mantine/next';
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

const stylesServer = createStylesServer();

export default class _Document extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      styles: [
        initialProps.styles,
        <ServerStyles html={initialProps.html} server={stylesServer} key='styles' />,
      ],
    };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/AMCBleckhornenLOGO.png" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="Ett internt verktyg för alla corps"
          />
          <link rel="manifest" href="/manifest.json" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}