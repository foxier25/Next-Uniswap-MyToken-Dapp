import type { AppProps } from 'next/app';
import { Inter as interFonts } from 'next/font/google';
import '../styles/globals.css'
import '../styles/button.css'
import { cookieToInitialState } from 'wagmi';
import { config } from '../config';
import ContextProvider from '../context';

const inter = interFonts({ subsets: ['latin'] });

function MyApp({ Component, pageProps, router }: AppProps) {
  const initialState = cookieToInitialState(config, (typeof document !== 'undefined' && document.cookie) || '');

  return (
        <ContextProvider initialState={initialState}>
          <Component {...pageProps} />
        </ContextProvider>
  );
}

export default MyApp;