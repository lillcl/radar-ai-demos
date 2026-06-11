import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="flex w-full flex-1 flex-col min-h-0">
      <App />
    </div>
  </React.StrictMode>
);
