import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';
import { BrowserRouter } from 'react-router-dom';
import { CameraProvider } from './layouts/Carosel/CameraContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <BrowserRouter>
    <CameraProvider>
      <App />
    </CameraProvider>
  </BrowserRouter>
);

