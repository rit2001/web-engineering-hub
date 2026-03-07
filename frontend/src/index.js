import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {ChakraProvider,theme} from '@chakra-ui/react'
import {Provider as ReduxProvider} from 'react-redux'
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ChakraProvider theme={theme}>
       <App />
     </ChakraProvider>
    </ReduxProvider>
  </React.StrictMode>
);
