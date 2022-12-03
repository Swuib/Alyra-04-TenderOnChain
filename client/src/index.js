import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { EthProvider } from "./contexts/EthContext";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import {store, persistor} from "./contexts/Redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EthProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>  
          <App />
        </PersistGate>
      </Provider>
    </EthProvider>
  </React.StrictMode>
);
