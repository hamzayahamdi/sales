// components
import {Helmet} from 'react-helmet';
import { MobileDateRangePicker } from '@mui/x-date-pickers-pro/MobileDateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Box, useMediaQuery, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import isoWeek from 'dayjs/plugin/isoWeek';
import { useState, useEffect } from 'react';
import { Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

// assets
import salesLogo from '../sales.svg';

// custom components
import MobileNav from './MobileNav';

// Configure dayjs to use Monday as first day of week
dayjs.extend(updateLocale);
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.locale('fr');

const datePickerStyles = {
    '& .MuiInputBase-root': {
        height: '36px',
        borderRadius: '4px',
        backgroundColor: '#599AED',
        border: 'none',
        width: '100%',
        minWidth: '185px',
        maxWidth: '200px',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        '& .MuiInputBase-input': {
            fontSize: '13px',
            fontWeight: '500',
            color: '#ffffff',
            textAlign: 'center',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            cursor: 'pointer',
            caretColor: 'transparent',
            '&::selection': {
                backgroundColor: 'transparent',
            },
            '&::-moz-selection': {
                backgroundColor: 'transparent',
            },
            '&::placeholder': {
                textAlign: 'center',
                color: '#9CA3AF'
            }
        }
    },
    '& .MuiPickersPopper-root': {
        '& .MuiPickersLayout-root': {
            backgroundColor: '#ffffff',
            color: '#111827',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        },
        '& .MuiDayCalendar-weekDayLabel': {
            color: '#6B7280',
        },
        '& .MuiPickersCalendarHeader-root': {
            color: '#111827',
            backgroundColor: '#ffffff',
        },
        '& .MuiPickersArrowSwitcher-button': {
            color: '#111827',
        },
        '& .MuiDayCalendar-header': {
            color: '#6B7280',
        },
        '& .MuiPickersDay-root': {
            color: '#111827',
            backgroundColor: '#ffffff',
            '&:hover': {
                backgroundColor: '#f3f4f6',
            },
            '&.Mui-selected': {
                backgroundColor: '#60A5FA',
                color: '#ffffff',
                '&:hover': {
                    backgroundColor: '#3b82f6',
                },
            },
        },
        '& .MuiDialogActions-root': {
            backgroundColor: '#ffffff',
            '& .MuiButton-root': {
                color: '#3b82f6',
            },
        },
    }
};

const shortcuts = [
    { label: "Aujourd'hui", value: "today" },
    { label: "Hier", value: "yesterday" },
    { label: "Cette semaine", value: "thisWeek" },
    { label: "Semaine dernière", value: "lastWeek" },
    { label: "Ce mois", value: "thisMonth" },
    { label: "Mois dernier", value: "lastMonth" },
];

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
            setCalendarOpen(false);
            setShortcutsOpen(false);
            setTimeout(() => {
                setShortcutsOpen(false);
            }, 100);
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

    // Add a new handler for when the date picker opens
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

    return (
        <>
            <Helmet>
                <title>Sales Dashboard</title>
            </Helmet>
            <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200" style={headerStyles}>
                <div className="flex flex-col w-full max-w-[1920px] mx-auto !bg-white">
                    <div className="flex items-center justify-between px-4 py-3 !bg-white">
                        <img 
                            src={salesLogo} 
                            alt="Sales Dashboard" 
                            className="h-[45px] w-auto object-contain" 
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

                        <div className="relative date-picker-container flex items-center">
                            <Box sx={datePickerStyles} className="flex-1">
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
                                    <MobileDateRangePicker
                                        value={parseDateRange()}
                                        onChange={handleDateChange}
                                        onOpen={() => {
                                            setShortcutsOpen(false);
                                            setCalendarOpen(true);
                                        }}
                                        onClose={() => setCalendarOpen(false)}
                                        open={calendarOpen}
                                        closeOnSelect={true}
                                        shortcuts={shortcuts}
                                        localeText={{ 
                                            start: 'Début', 
                                            end: 'Fin',
                                            calendarWeekNumberText: 'Semaine',
                                            previousMonth: 'Mois précédent',
                                            nextMonth: 'Mois suivant'
                                        }}
                                        slots={{
                                            field: SingleInputDateRangeField,
                                            actionBar: () => null,
                                        }}
                                        slotProps={{
                                            textField: { size: 'small' },
                                            field: { readOnly: true },
                                            layout: {
                                                sx: {
                                                    bgcolor: '#ffffff',
                                                    color: '#111827',
                                                    '& .MuiPickersLayout-contentWrapper': {
                                                        bgcolor: '#ffffff',
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
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
        </>
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