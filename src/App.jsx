import './config/mui';
// React and Router imports
import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

// MUI imports
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

// Third-party imports
import ReactGA from 'react-ga4';
import { ToastContainer } from 'react-toastify';

// Contexts
import { ThemeProvider } from 'styled-components';
import { useTheme } from '@contexts/themeContext';

// Components
import ScrollToTop from '@components/ScrollToTop';
import Loader from '@components/Loader';
import ThemeStyles from '@styles/theme';

// Styles
import '@styles/index.scss';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-grid-layout/css/styles.css';
import 'dayjs/locale/fr';

// Fonts
import '@fonts/icomoon/style.css';
import '@fonts/icomoon/icomoon.woff';

// Lazy loaded components
const DashboardA = lazy(() => import('@pages/DashboardA'));
const PageNotFound = lazy(() => import('@pages/PageNotFound'));

const APP_VERSION = '1.0.0'; // Update this when you deploy

const App = () => {
    const { theme } = useTheme();

    // Create MUI theme with dark mode
    const muiTheme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#60A5FA',
            },
            background: {
                default: '#111827',
                paper: '#1F2937',
            },
            text: {
                primary: '#E5E7EB',
                secondary: '#9CA3AF',
            }
        },
        components: {
            MuiDateRangeCalendar: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#1F2937',
                        '& .MuiPickersCalendarHeader-root': {
                            color: '#E5E7EB',
                            backgroundColor: '#1F2937',
                        },
                        '& .MuiDayPicker-weekDayLabel': {
                            color: '#9CA3AF',
                        },
                        '& .MuiPickersDay-root': {
                            color: '#E5E7EB',
                            backgroundColor: '#1F2937',
                            '&:hover': {
                                backgroundColor: '#374151',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#2563EB',
                                color: '#ffffff',
                            }
                        }
                    }
                }
            },
            MuiPickersPopper: {
                styleOverrides: {
                    paper: {
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        '& .MuiPickersLayout-root': {
                            backgroundColor: '#1F2937',
                        },
                        '& .MuiDialogActions-root': {
                            backgroundColor: '#1F2937',
                        }
                    }
                }
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#1F2937',
                        color: '#E5E7EB',
                        '&:hover': {
                            backgroundColor: '#374151',
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#2563EB',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#1D4ED8',
                            }
                        }
                    }
                }
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#111827',
                        '&:hover': {
                            backgroundColor: '#1F2937',
                        },
                        '&.Mui-focused': {
                            backgroundColor: '#1F2937',
                        }
                    },
                    select: {
                        padding: '8px 12px',
                        color: '#E5E7EB',
                    },
                    icon: {
                        color: '#6B7280',
                    }
                }
            },
            MuiMenu: {
                styleOverrides: {
                    paper: {
                        backgroundColor: '#111827',
                        border: '1px solid #374151',
                        boxShadow: '0 4px 25px 0 rgba(0,0,0,0.3)',
                        '& .MuiMenuItem-root': {
                            color: '#E5E7EB',
                            '&:hover': {
                                backgroundColor: '#1F2937',
                            },
                            '&.Mui-selected': {
                                backgroundColor: '#1F2937',
                                '&:hover': {
                                    backgroundColor: '#374151',
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Google Analytics init
    const gaKey = import.meta.env.VITE_GA;
    gaKey && ReactGA.initialize(gaKey);

    useEffect(() => {
        document.title = "Sales Analytics | Sketch Design";
    }, []);

    // Add this style block at the top of your App component
    const GlobalStyle = () => (
        <style>
            {`
                input[type="text"],
                input[type="number"],
                input[type="email"],
                input[type="tel"],
                input[type="password"],
                input[type="search"],
                select,
                textarea {
                    font-size: 16px !important;
                    /* Prevent zoom on iOS */
                    @supports (-webkit-touch-callout: none) {
                        font-size: 16px !important;
                    }
                }
            `}
        </style>
    );

    useEffect(() => {
        const checkVersion = async () => {
            try {
                const response = await fetch('/version.json?t=' + new Date().getTime());
                const data = await response.json();
                
                if (data.version !== APP_VERSION) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('Version check failed:', error);
            }
        };

        // Check version every minute
        const interval = setInterval(checkVersion, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <HelmetProvider>
            <GlobalStyle />
            <Helmet>
                <title>Sales Analytics | Sketch Design</title>
                <meta name="description" content="Sales Analytics Dashboard by Sketch Design" />
            </Helmet>
            <MuiThemeProvider theme={muiTheme}>
                <LocalizationProvider 
                    dateAdapter={AdapterDayjs} 
                    adapterLocale="fr"
                    localeText={{ start: 'Début', end: 'Fin' }}
                >
                    <ThemeProvider theme={{ theme: 'dark' }}>
                        <ThemeStyles />
                        <ToastContainer theme="dark" autoClose={2000} />
                        <ScrollToTop />
                        <div className="min-h-screen bg-[#111827]">
                            <Suspense fallback={<Loader />}>
                                <Routes>
                                    <Route path="/login" element={<Login />} />
                                    <Route 
                                        path="/dashboard" 
                                        element={
                                            <ProtectedRoute>
                                                <DashboardA />
                                            </ProtectedRoute>
                                        } 
                                    />
                                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                    <Route path="*" element={<Navigate to="/404" />} />
                                    <Route path="/404" element={<PageNotFound />} />
                                </Routes>
                            </Suspense>
                        </div>
                    </ThemeProvider>
                </LocalizationProvider>
            </MuiThemeProvider>
        </HelmetProvider>
    );
}

export default App;
