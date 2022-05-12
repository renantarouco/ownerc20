import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { MoralisProvider } from 'react-moralis';
import { ToastContainer } from 'react-toastify';
import config from '../config';
import 'react-toastify/dist/ReactToastify.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MoralisProvider serverUrl={config.MORALIS_SERVER_URL} appId={config.MORALIS_APP_ID} dangerouslyUseOfMasterKey="T3SXce5ULtFz6d50F37FM2Pmfpsd8Cp0OFRIC3dN">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
        <Component {...pageProps} className="h-full" />
    </MoralisProvider>
  );
}

export default MyApp;
