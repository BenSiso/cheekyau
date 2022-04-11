import { useLocalStorageState, useMount } from 'ahooks';
import 'antd/dist/antd.css';
import { useRouter } from 'next/dist/client/router';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import React, { useEffect } from 'react';
import { RecoilRoot } from 'recoil';
import 'tailwindcss/tailwind.css';
import Main from '../layout/Main';
import initAuth from '../services/initAuth';
import '../styles/globals.css';
import '../utilities/i18n';

const Loading = dynamic(() => import('../components/Loading'), { ssr: false });
initAuth();

NProgress.configure({
  minimum: 0.6,
  easing: 'ease',
  speed: 500,
  trickleSpeed: 100,
  showSpinner: true,
});
function MyApp({ Component, pageProps }) {
  // Component State Control
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  useMount(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  });
  useEffect(() => {
    router.events.on('routeChangeStart', () => NProgress.start());
    router.events.on('routeChangeComplete', () => NProgress.done());
    router.events.on('routeChangeError', () => NProgress.done());
  }, []);
  const [threads] = useLocalStorageState('localHistory', []);

  const Layout = Component.Layout ? Component.Layout : React.Fragment;
  return (
    <RecoilRoot>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/images/logo.png' />
        <link rel='apple-touch-icon' sizes='57x57' href='/apple-icon-57x57.png' />
        <link rel='apple-touch-icon' sizes='60x60' href='/apple-icon-60x60.png' />
        <link rel='apple-touch-icon' sizes='72x72' href='/apple-icon-72x72.png' />
        <link rel='apple-touch-icon' sizes='76x76' href='/apple-icon-76x76.png' />
        <link rel='apple-touch-icon' sizes='114x114' href='/apple-icon-114x114.png' />
        <link rel='apple-touch-icon' sizes='120x120' href='/apple-icon-120x120.png' />
        <link rel='apple-touch-icon' sizes='144x144' href='/apple-icon-144x144.png' />
        <link rel='apple-touch-icon' sizes='152x152' href='/apple-icon-152x152.png' />
        <link rel='apple-touch-icon' sizes='180x180' href='/apple-icon-180x180.png' />
        <link rel='icon' type='image/png' sizes='192x192' href='/android-icon-192x192.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='96x96' href='/favicon-96x96.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicon-16x16.png' />

        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
        <meta name='theme-color' content='#ffffff' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-title' content='Cheeky Web' />
      </Head>
      {loading ? (
        <Loading />
      ) : (
        <Layout>
          {router.asPath.includes('admin') || router.asPath.includes('register') ? (
            <Component {...pageProps} />
          ) : (
            <Main
              {...(router.asPath.includes('history')
                ? { ...pageProps, threads }
                : { ...pageProps })}
            />
          )}
        </Layout>
      )}
    </RecoilRoot>
  );
}

export default MyApp;
