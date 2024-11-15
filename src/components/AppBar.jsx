// components
import {Helmet} from 'react-helmet';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Box, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme, ThemeProvider, createTheme, styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useState, useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { FaUserCircle, FaSignOutAlt, FaStore, FaUserShield, FaCalculator } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWindowSize } from 'react-use';

// assets
import salesLogo from '../sales.svg';

// custom components
import MobileNav from './MobileNav';

// Configure dayjs to use Monday as first day of week
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.locale('fr');

const shortcuts = [
    { label: "Aujourd'hui", value: "today" },
    { label: "Hier", value: "yesterday" },
    { label: "Cette semaine", value: "thisWeek" },
    { label: "Semaine dernière", value: "lastWeek" },
    { label: "Ce mois", value: "thisMonth" },
    { label: "Mois dernier", value: "lastMonth" },
];

// Add this styled component for the global styles
const StyledWrapper = styled('div')`
    .MuiTextField-root .MuiInputBase-adornedEnd input[type=text] {
        font-size: 13px !important;
    }

    .mx-auto {
        margin-left: 0px;
        margin-right: 0px;
        max-width: none;
    }

    .border-b .mx-auto {
        width: 100% !important;
    }

    @media screen and (max-width: 414px) {
        div.flex.flex-col.w-full.\!bg-white div.flex.items-center.justify-between.px-4.py-3.\!bg-white img {
            height: 35px !important;
            min-height: 35px !important;
            max-height: 35px !important;
        }
    }
`;

const UserProfile = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const profileRef = useRef(null);
    const { width } = useWindowSize();
    const isMobile = width < 768;
    
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userStore = localStorage.getItem('userStore');

    const getRoleIcon = (role) => {
        switch(role) {
            case 'admin':
                return <FaUserShield className="w-4 h-4" />;
            case 'comptabilite':
                return <FaCalculator className="w-4 h-4" />;
            case 'store_manager':
                return <FaStore className="w-4 h-4" />;
            default:
                return <FaUserCircle className="w-4 h-4" />;
        }
    };

    const getRoleLabel = (role) => {
        switch(role) {
            case 'admin':
                return 'Administrateur';
            case 'comptabilite':
                return 'Comptabilité';
            case 'store_manager':
                return 'Manager';
            default:
                return role;
        }
    };

    const getStoreLabel = (store) => {
        switch(store) {
            case '1': return 'Casa';
            case '2': return 'Rabat';
            case '5': return 'Tanger';
            case '6': return 'Marrakech';
            case 'all': return 'Global';
            default: return store;
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`fixed ${isMobile ? 'top-[84px]' : 'bottom-4'} right-4 z-50`} ref={profileRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-[#599AED] to-[#3B82F6] hover:from-[#4080d4] hover:to-[#2563EB] transition-all duration-300 flex items-center justify-center shadow-lg"
            >
                <FaUserCircle className="w-4 h-4 text-white" />
            </button>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
                className={`absolute ${isMobile ? 'top-full' : 'bottom-full'} right-0 ${isMobile ? 'mt-2' : 'mb-2'} w-48 origin-${isMobile ? 'top' : 'bottom'}-right`}
            >
                <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg ring-1 ring-black/5 divide-y divide-gray-100">
                    <div className="p-3">
                        <div className="text-sm font-medium text-gray-900">{userName}</div>
                        {userStore !== 'all' && (
                            <div className="flex items-center gap-1.5 mt-1 text-gray-600">
                                <FaStore className="w-3 h-3" />
                                <span className="text-xs">{getStoreLabel(userStore)}</span>
                            </div>
                        )}
                    </div>
                    <div className="p-1">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt className="w-3.5 h-3.5" />
                            Se déconnecter
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

const AppBar = ({
    title = 'Dashboard',
    dateRange,
    onDateRangeChange,
    selectedStoreId,
    onStoreChange,
    storeSales = {},
    loading = false
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const [shortcutsOpen, setShortcutsOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);

    const parseDateRange = () => {
        if (typeof dateRange === 'string') {
            const [startStr, endStr] = dateRange.split(' - ');
            return [
                dayjs(startStr, 'DD/MM/YYYY'),
                dayjs(endStr, 'DD/MM/YYYY')
            ];
        }
        return dateRange;
    };

    const handleDateChange = (newValue) => {
        if (newValue[0] && newValue[1]) {
            const formattedRange = `${newValue[0].format('DD/MM/YYYY')} - ${newValue[1].format('DD/MM/YYYY')}`;
            onDateRangeChange(formattedRange);
            updateSelectedShortcut(newValue[0], newValue[1]);
        }
    };

    const [selectedShortcut, setSelectedShortcut] = useState(null);

    const updateSelectedShortcut = (startDate, endDate) => {
        const today = dayjs();
        
        if (startDate.isSame(today, 'day') && endDate.isSame(today, 'day')) {
            setSelectedShortcut('today');
        } else if (startDate.isSame(today.subtract(1, 'day'), 'day') && endDate.isSame(today.subtract(1, 'day'), 'day')) {
            setSelectedShortcut('yesterday');
        } else if (startDate.isSame(today.startOf('isoWeek'), 'day') && endDate.isSame(today.endOf('isoWeek'), 'day')) {
            setSelectedShortcut('thisWeek');
        } else if (
            startDate.isSame(today.subtract(1, 'week').startOf('isoWeek'), 'day') && 
            endDate.isSame(today.subtract(1, 'week').endOf('isoWeek'), 'day')
        ) {
            setSelectedShortcut('lastWeek');
        } else if (startDate.isSame(today.startOf('month'), 'day') && endDate.isSame(today.endOf('month'), 'day')) {
            setSelectedShortcut('thisMonth');
        } else if (
            startDate.isSame(today.subtract(1, 'month').startOf('month'), 'day') && 
            endDate.isSame(today.subtract(1, 'month').endOf('month'), 'day')
        ) {
            setSelectedShortcut('lastMonth');
        } else {
            setSelectedShortcut(null);
        }
    };

    useEffect(() => {
        const [start, end] = parseDateRange();
        updateSelectedShortcut(start, end);
    }, [dateRange]);

    const headerStyles = {
        backgroundColor: '#ffffff !important',
        '.min-h-screen': {
            backgroundColor: '#ffffff !important'
        }
    };

    const handleDatePickerOpen = () => {
        setShortcutsOpen(false);
        setCalendarOpen(true);
    };

    const handleDatePickerClose = () => {
        setCalendarOpen(false);
        setShortcutsOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (shortcutsOpen && !event.target.closest('.date-picker-container')) {
                setShortcutsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [shortcutsOpen]);

    // Keep the datePickerStyles constant as it is for the input styling

    const datePickerStyles = {
        '& .MuiInputBase-root': {
            height: '36px',
            borderRadius: '4px',
            backgroundColor: '#599AED',
            border: 'none',
            width: '100%',
            minWidth: '185px',
            maxWidth: '200px',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            '& fieldset': {
                border: 'none'
            },
            '&:hover fieldset': {
                border: 'none'
            },
            '&.Mui-focused fieldset': {
                border: 'none'
            },
            '& .MuiInputBase-input': {
                fontSize: '13px',
                fontWeight: '500',
                color: '#ffffff',
                textAlign: 'center',
                cursor: 'pointer',
                caretColor: 'transparent',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none',
                '&::selection': {
                    backgroundColor: 'transparent',
                },
                '&::-moz-selection': {
                    backgroundColor: 'transparent',
                }
            }
        }
    };

    // Add a simplified theme that only styles the calendar
    const datePickerTheme = createTheme({
        components: {
            MuiDialog: {
                styleOverrides: {
                    paper: {
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        overflow: 'hidden'
                    }
                }
            },
            MuiPickersLayout: {
                styleOverrides: {
                    root: {
                        '& .MuiPickersCalendarHeader-label': {
                            color: '#5899ED'
                        },
                        '& .MuiPickersArrowSwitcher-button': {
                            color: '#5899ED'
                        },
                        '& .MuiDayCalendar-weekDayLabel': {
                            color: '#5899ED'
                        },
                        '& .MuiPickersDay-root': {
                            color: '#5899ED'
                        },
                        '& .MuiDialogActions-root': {
                            backgroundColor: '#5899ED',
                            '& .MuiButton-root': {
                                color: '#ffffff'
                            }
                        }
                    }
                },
                defaultProps: {
                    localeText: {
                        cancelButtonLabel: 'Annuler',
                        okButtonLabel: 'Valider',
                        clearButtonLabel: 'Effacer',
                        todayButtonLabel: "Aujourd'hui",
                        start: 'Début',
                        end: 'Fin',
                        clockLabelText: 'Sélectionnez l\'heure',
                        hoursClockNumberText: 'heures',
                        minutesClockNumberText: 'minutes',
                        secondsClockNumberText: 'secondes',
                    }
                }
            },
            MuiPickersToolbar: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#5899ED',
                        color: '#ffffff',
                        padding: '16px 24px',
                        '& .MuiTypography-root': {
                            color: '#ffffff'
                        },
                        '& .MuiPickersToolbar-penIconButton': {
                            color: '#ffffff'
                        }
                    }
                },
                defaultProps: {
                    localeText: {
                        dateRangePickerToolbarTitle: 'Sélectionner la période',
                        datePickerToolbarTitle: 'Sélectionner les dates',
                        timePickerToolbarTitle: "Sélectionner l'heure"
                    }
                }
            },
            MuiDateRangePickerToolbar: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#5899ED',
                        '& .MuiTypography-root': {
                            color: '#ffffff'
                        },
                        '& .MuiDateRangePickerToolbar-container': {
                            '& .MuiTypography-root': {
                                color: '#ffffff'
                            }
                        }
                    }
                }
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'transparent',
                        color: '#5899ED',
                        '&:hover': {
                            backgroundColor: '#5899ED20'
                        },
                        '&.Mui-selected': {
                            backgroundColor: '#5899ED',
                            color: '#ffffff',
                            '&:hover': {
                                backgroundColor: '#5899ED'
                            }
                        },
                        '&.MuiPickersDay-today': {
                            borderColor: '#5899ED',
                            backgroundColor: 'transparent'
                        }
                    }
                }
            },
            MuiDateRangePickerDay: {
                styleOverrides: {
                    root: {
                        backgroundColor: 'transparent',
                        '& .MuiDateRangePickerDay-rangeIntervalPreview': {
                            backgroundColor: '#5899ED20'
                        },
                        '& .MuiDateRangePickerDay-day': {
                            backgroundColor: 'transparent',
                            '&.Mui-selected': {
                                backgroundColor: '#5899ED',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#5899ED'
                                }
                            },
                            '&.MuiDateRangePickerDay-dayInsideRangeInterval': {
                                backgroundColor: '#5899ED',
                                color: '#ffffff',
                                '&:hover': {
                                    backgroundColor: '#5899ED'
                                }
                            }
                        }
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        '&:hover': {
                            backgroundColor: '#ffffff20'
                        }
                    }
                }
            },
            MuiPickersCalendarHeader: {
                defaultProps: {
                    localeText: {
                        monthNames: [
                            'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
                        ],
                    }
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-adornedEnd input[type=text]': {
                            fontSize: '13px !important'
                        }
                    }
                }
            }
        }
    });

    useEffect(() => {
        // Add global style for mobile logo
        const style = document.createElement('style');
        style.textContent = `
            @media screen and (max-width: 414px) {
                .\\!bg-white img[alt="Sales Dashboard"] {
                    height: 35px !important;
                    min-height: 35px !important;
                    max-height: 35px !important;
                }
            }
        `;
        document.head.appendChild(style);

        // Cleanup
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <StyledWrapper>
            <Helmet>
                <title>Sales Dashboard</title>
                <meta 
                    name="viewport" 
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
                />
            </Helmet>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200" style={headerStyles}>
                <div className="flex flex-col w-full !bg-white">
                    <div className="flex items-center justify-between px-4 py-3 !bg-white">
                        <img 
                            src={salesLogo} 
                            alt="Sales Dashboard" 
                            className="md:h-[45px] h-[35px] w-auto object-contain sales-logo"
                        />
                        
                        {!isMobile && (
                            <div className="flex-1 flex justify-center mx-4">
                                <MobileNav 
                                    selectedStoreId={selectedStoreId} 
                                    onStoreChange={onStoreChange} 
                                    isDesktop={true}
                                    storeSales={storeSales}
                                    loading={loading}
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            {!isMobile && <UserProfile />}
                            <div className="relative date-picker-container flex items-center">
                                <Box sx={datePickerStyles}>
                                    <ThemeProvider theme={datePickerTheme}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                            <MobileDateRangePicker
                                                value={parseDateRange()}
                                                onChange={handleDateChange}
                                                slots={{
                                                    field: SingleInputDateRangeField
                                                }}
                                                slotProps={{
                                                    textField: { size: 'small' },
                                                    field: { readOnly: true }
                                                }}
                                                localeText={{ 
                                                    start: 'Début',
                                                    end: 'Fin',
                                                    cancel: 'Annuler',
                                                    ok: 'Valider',
                                                    today: "Aujourd'hui",
                                                    calendarWeekNumberHeaderText: 'Semaine',
                                                    calendarWeekNumberText: n => `S${n}`,
                                                    clockLabelText: 'Sélectionnez l\'heure',
                                                    hoursClockNumberText: 'heures',
                                                    minutesClockNumberText: 'minutes',
                                                    secondsClockNumberText: 'secondes',
                                                    selectedRangeStartLabel: 'Début de période',
                                                    selectedRangeEndLabel: 'Fin de période',
                                                    dateRangePickerToolbarTitle: 'Sélectionner la période'
                                                }}
                                            />
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Box>

                                {/* Dropdown Button - Updated styling */}
                                <button
                                    onClick={() => {
                                        if (!calendarOpen) {
                                            setShortcutsOpen(!shortcutsOpen);
                                        }
                                    }}
                                    className="ml-2 p-2 rounded-md bg-[#599AED] hover:bg-[#4080d4] transition-colors"
                                >
                                    <ChevronDownIcon 
                                        className={`w-5 h-5 text-white transition-transform duration-200 ${shortcutsOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                {/* Animated Shortcuts Dropdown - Updated positioning */}
                                <Transition
                                    show={shortcutsOpen && !calendarOpen}
                                    enter="transition ease-out duration-200"
                                    enterFrom="transform opacity-0 scale-95"
                                    enterTo="transform opacity-100 scale-100"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="transform opacity-100 scale-100"
                                    leaveTo="transform opacity-0 scale-95"
                                    className="absolute right-0 top-full mt-2 w-56 origin-top-right z-50"
                                >
                                    <div className="bg-[#599AED] rounded-lg shadow-xl py-1">
                                        {shortcuts.map((shortcut) => (
                                            <button
                                                key={shortcut.value}
                                                onClick={() => {
                                                    let dates;
                                                    const today = dayjs();
                                                    
                                                    switch(shortcut.value) {
                                                        case 'today':
                                                            dates = [today, today];
                                                            break;
                                                        case 'yesterday':
                                                            const yesterday = today.subtract(1, 'day');
                                                            dates = [yesterday, yesterday];
                                                            break;
                                                        case 'thisWeek':
                                                            const thisWeekStart = today.startOf('isoWeek');
                                                            const thisWeekEnd = today.endOf('isoWeek');
                                                            dates = [thisWeekStart, thisWeekEnd];
                                                            break;
                                                        case 'lastWeek':
                                                            const lastWeekStart = today.subtract(1, 'week').startOf('isoWeek');
                                                            const lastWeekEnd = lastWeekStart.endOf('isoWeek');
                                                            dates = [lastWeekStart, lastWeekEnd];
                                                            break;
                                                        case 'thisMonth':
                                                            dates = [today.startOf('month'), today.endOf('month')];
                                                            break;
                                                        case 'lastMonth':
                                                            const lastMonth = today.subtract(1, 'month');
                                                            dates = [
                                                                lastMonth.startOf('month'),
                                                                lastMonth.endOf('month')
                                                            ];
                                                            break;
                                                        default:
                                                            dates = [today, today];
                                                    }
                                                    handleDateChange(dates);
                                                    setShortcutsOpen(false);
                                                }}
                                                className={`
                                                    w-full px-4 py-3 text-sm flex items-center space-x-3
                                                    ${selectedShortcut === shortcut.value 
                                                        ? 'bg-[#4080d4] text-white font-medium'
                                                        : 'text-white hover:bg-[#4080d4]'
                                                    }
                                                    transition-all duration-150 ease-in-out
                                                    relative
                                                    ${selectedShortcut === shortcut.value ? 'after:absolute after:left-0 after:top-0 after:bottom-0 after:w-0.5 after:bg-white' : ''}
                                                `}
                                            >
                                                <span className="flex-1 text-left">{shortcut.label}</span>
                                                {selectedShortcut === shortcut.value && (
                                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/10">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="h-[76px]" />

            {isMobile && (
                <MobileNav 
                    selectedStoreId={selectedStoreId} 
                    onStoreChange={onStoreChange} 
                    isDesktop={false}
                    storeSales={storeSales}
                    loading={loading}
                />
            )}

            <UserProfile />
        </StyledWrapper>
    );
};

AppBar.propTypes = {
    title: PropTypes.string,
    dateRange: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.object)
    ]).isRequired,
    onDateRangeChange: PropTypes.func.isRequired,
    selectedStoreId: PropTypes.string.isRequired,
    onStoreChange: PropTypes.func.isRequired
};

export default AppBar;