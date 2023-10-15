import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import { PersistGate } from 'reduxjs-toolkit-persist/integration/react';

import { store, persistor } from './store';
import App from './App';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <App />
    </PersistGate>
  </Provider>
);
