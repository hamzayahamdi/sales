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
import { useState, useEffect } from 'react';

// assets
import salesLogo from '../sales.svg';

// custom components
import MobileNav from './MobileNav';

const datePickerStyles = {
    '& .MuiInputBase-root': {
        height: '36px',
        borderRadius: '4px',
        backgroundColor: '#111827',
        border: '1px solid #374151',
        width: '100%',
        minWidth: '185px',
        maxWidth: '200px',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        '&:hover': {
            borderColor: '#4B5563',
        },
        '&.Mui-focused': {
            borderColor: '#60A5FA',
            boxShadow: '0 0 0 2px rgba(96, 165, 250, 0.1)',
        },
        '& .MuiInputBase-input': {
            fontSize: '13px',
            fontWeight: '500',
            color: '#E5E7EB',
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
            backgroundColor: '#111827',
            color: '#E5E7EB',
            border: '1px solid #374151',
        },
        '& .MuiDayCalendar-header': {
            color: '#9CA3AF',
        },
        '& .MuiPickersDay-root': {
            color: '#E5E7EB',
            '&:hover': {
                backgroundColor: '#374151',
            },
            '&.Mui-selected': {
                backgroundColor: '#60A5FA',
            },
        },
        '& .MuiPickersShortcuts-root': {
            borderRight: '1px solid #374151',
            '& .MuiMenuItem-root': {
                color: '#E5E7EB',
                minHeight: '32px',
                '&:hover': {
                    backgroundColor: '#374151',
                },
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
    onStoreChange
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tooltipOpen, setTooltipOpen] = useState(false);

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
        } else if (startDate.isSame(today.startOf('week'), 'day') && endDate.isSame(today, 'day')) {
            setSelectedShortcut('thisWeek');
        } else if (startDate.isSame(today.subtract(1, 'week').startOf('week'), 'day') && 
                   endDate.isSame(today.subtract(1, 'week').endOf('week'), 'day')) {
            setSelectedShortcut('lastWeek');
        } else if (startDate.isSame(today.startOf('month'), 'day') && endDate.isSame(today, 'day')) {
            setSelectedShortcut('thisMonth');
        } else if (startDate.isSame(today.subtract(1, 'month').startOf('month'), 'day') && 
                   endDate.isSame(today.subtract(1, 'month').endOf('month'), 'day')) {
            setSelectedShortcut('lastMonth');
        } else {
            setSelectedShortcut(null);
        }
    };

    useEffect(() => {
        const [start, end] = parseDateRange();
        updateSelectedShortcut(start, end);
    }, [dateRange]);

    const tooltipContent = (
        <div className="flex flex-col gap-1 py-1">
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
                                dates = [today.startOf('week'), today];
                                break;
                            case 'lastWeek':
                                dates = [
                                    today.subtract(1, 'week').startOf('week'),
                                    today.subtract(1, 'week').endOf('week')
                                ];
                                break;
                            case 'thisMonth':
                                dates = [today.startOf('month'), today];
                                break;
                            case 'lastMonth':
                                dates = [
                                    today.subtract(1, 'month').startOf('month'),
                                    today.subtract(1, 'month').endOf('month')
                                ];
                                break;
                            default:
                                dates = [today, today];
                        }
                        handleDateChange(dates);
                        setTooltipOpen(false);
                    }}
                    className={`px-3 py-1.5 text-sm text-gray-300 hover:bg-[#374151] rounded-md text-left transition-colors w-full
                        ${selectedShortcut === shortcut.value ? 'bg-[#374151] text-white' : ''}`}
                >
                    {shortcut.label}
                </button>
            ))}
        </div>
    );

    return (
        <>
            <Helmet>
                <title>Sales Dashboard</title>
            </Helmet>
            <div className="fixed top-0 left-0 right-0 z-50 bg-[#111827]">
                <div className="flex flex-col w-full max-w-[1920px] mx-auto">
                    <div className="flex items-center justify-between px-4 py-3 bg-[#111827] border-none">
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
                                />
                            </div>
                        )}

                        <Tooltip 
                            open={tooltipOpen}
                            onOpen={() => setTooltipOpen(true)}
                            onClose={() => setTooltipOpen(false)}
                            title={tooltipContent}
                            placement="bottom"
                            arrow
                            componentsProps={{
                                tooltip: {
                                    sx: {
                                        bgcolor: '#111827',
                                        '& .MuiTooltip-arrow': {
                                            color: '#111827',
                                        },
                                        border: '1px solid #374151',
                                        borderRadius: '8px',
                                        p: 1,
                                    },
                                },
                            }}
                        >
                            <Box sx={datePickerStyles}>
                                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                                    <MobileDateRangePicker
                                        value={parseDateRange()}
                                        onChange={handleDateChange}
                                        shortcuts={shortcuts}
                                        localeText={{ start: 'Début', end: 'Fin' }}
                                        slots={{
                                            field: SingleInputDateRangeField,
                                        }}
                                        slotProps={{
                                            textField: { size: 'small' },
                                            field: { readOnly: true },
                                            shortcuts: {
                                                sx: {
                                                    bgcolor: '#111827',
                                                    '& .MuiMenuItem-root': {
                                                        color: '#E5E7EB',
                                                        '&:hover': {
                                                            bgcolor: '#374151',
                                                        },
                                                    },
                                                },
                                            },
                                            layout: {
                                                sx: {
                                                    bgcolor: '#111827',
                                                    color: '#E5E7EB',
                                                    '& .MuiPickersLayout-contentWrapper': {
                                                        bgcolor: '#111827',
                                                    },
                                                    '& .MuiDialogActions-root': {
                                                        bgcolor: '#111827',
                                                    },
                                                },
                                            },
                                        }}
                                    />
                                </LocalizationProvider>
                            </Box>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div className="h-[76px]" />

            {isMobile && <MobileNav selectedStoreId={selectedStoreId} onStoreChange={onStoreChange} isDesktop={false} />}
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