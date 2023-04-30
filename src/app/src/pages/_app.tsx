import { MantineThemeOverride } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { AppContext, AppProps } from 'next/app';
import { withMantine } from '../utils/mantine';

declare global {
  export interface AppInitialProps extends AppProps {
    pageProps: AppInitialPageProps;
  }
  export interface AppInitialPageProps {

  }
}

function App(props: AppInitialProps) {
  const { Component, pageProps } = props;

  return <Component {...pageProps} />
}

export default withMantine(App, {
  cookie: `seitz-api-color-scheme`,
  withGlobalStyles: true,
  withNormalizeCSS: true,
  colorScheme: 'dark',
})