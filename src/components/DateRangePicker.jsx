import { useState } from 'react';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { Box } from '@mui/material';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

const shortcuts = [
    {
        label: "Aujourd'hui",
        getValue: () => {
            const today = dayjs();
            return [today, today];
        },
    },
    {
        label: 'Hier',
        getValue: () => {
            const yesterday = dayjs().subtract(1, 'day');
            return [yesterday, yesterday];
        },
    },
    {
        label: 'Cette semaine',
        getValue: () => {
            return [dayjs().startOf('week'), dayjs()];
        },
    },
    {
        label: 'Semaine dernière',
        getValue: () => {
            return [
                dayjs().subtract(1, 'week').startOf('week'),
                dayjs().subtract(1, 'week').endOf('week')
            ];
        },
    },
    {
        label: 'Ce mois',
        getValue: () => {
            return [dayjs().startOf('month'), dayjs()];
        },
    },
    {
        label: 'Mois dernier',
        getValue: () => {
            return [
                dayjs().subtract(1, 'month').startOf('month'),
                dayjs().subtract(1, 'month').endOf('month')
            ];
        },
    },
];

const CustomDateRangePicker = ({ value, onChange }) => {
    // Parse the initial date range
    const [startDate, endDate] = value.split(' - ').map(date => 
        dayjs(date, 'DD/MM/YYYY')
    );
    
    const [dateRange, setDateRange] = useState([startDate, endDate]);

    const handleDateChange = (newValue) => {
        setDateRange(newValue);
        if (newValue[0] && newValue[1]) {
            const formattedRange = `${newValue[0].format('DD/MM/YYYY')} - ${newValue[1].format('DD/MM/YYYY')}`;
            onChange(formattedRange);
        }
    };

    return (
        <Box sx={{ 
            '& .MuiInputBase-root': {
                backgroundColor: 'white',
                fontSize: '14px',
                height: '40px',
            },
            '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e2e8f0',
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#43A6E8 !important',
            },
            '& .MuiInputBase-input': {
                padding: '8px 14px',
            }
        }}>
            <DateRangePicker
                value={dateRange}
                onChange={handleDateChange}
                localeText={{ start: 'Début', end: 'Fin' }}
                shortcuts={shortcuts}
                slotProps={{
                    textField: { size: 'small' },
                    field: { readOnly: true },
                    popper: {
                        sx: {
                            '& .MuiPickersDay-root.Mui-selected': {
                                backgroundColor: '#43A6E8',
                            },
                            '& .MuiPickersShortcuts-list': {
                                paddingLeft: '16px',
                                paddingRight: '16px',
                            }
                        }
                    }
                }}
                slots={{
                    field: SingleInputDateRangeField
                }}
            />
        </Box>
    );
};

export default CustomDateRangePicker; 