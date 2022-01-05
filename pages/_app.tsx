import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Fragment } from 'react';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Fragment>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Monoton&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Component {...pageProps} />
      <canvas
        id="confetti-canvas"
        className="absolute left-0 top-0"
        style={{ pointerEvents: 'none' }}
      ></canvas>
    </Fragment>
  );
}

export default MyApp;
