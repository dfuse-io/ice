import React from 'react';
import { theme } from './theme';
import { UALProvider } from 'ual-reactjs-renderer';
import { Scatter } from 'ual-scatter';
import { Anchor } from 'ual-anchor';
import { ThemeProvider } from 'emotion-theming';
import { AppStateProvider } from './state/state';
import { AppLayout } from './components/layout/layout';
import './App.scss';

const iceNet = {
  chainId: process.env.REACT_APP_DFUSE_CHAIN_ID || '',
  rpcEndpoints: [
    {
      protocol: 'http',
      host: 'localhost',
      port: Number('13026'),
    },
  ],
};
const appName = 'ICE';
const scatter = new Scatter([iceNet], { appName });
const anchor = new Anchor([iceNet], { appName });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <UALProvider
        chains={[iceNet]}
        authenticators={[scatter, anchor]}
        appName={appName}
      >
        <AppStateProvider>
          <AppLayout />
        </AppStateProvider>
      </UALProvider>
    </ThemeProvider>
  );
}

export default App;
