import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axe from '@axe-core/react';

// Only run axe in development mode
if (process.env.NODE_ENV === 'development') {
    axe(React, ReactDOM, 1000);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
