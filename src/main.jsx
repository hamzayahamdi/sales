import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider as AppThemeProvider } from '@contexts/themeContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AppThemeProvider>
                <App />
            </AppThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
); 