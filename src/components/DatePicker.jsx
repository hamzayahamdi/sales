// components
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/fr'; // Import French locale

// hooks
import {useTheme} from '@contexts/themeContext';
import {useWindowSize} from 'react-use';

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

const DatePicker = ({value, onChange, id}) => {
    const {theme} = useTheme();
    const {width} = useWindowSize();
    const Picker = width < 768 ? MobileDateTimePicker : DesktopDateTimePicker;

    // Set French locale
    dayjs.locale('fr');

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fr">
            <Picker 
                value={value}
                onChange={(newValue) => onChange(newValue)}
                minDate={dayjs()}
                shortcuts={shortcuts}
                slotProps={{
                    textField: {
                        id: id
                    },
                    dialog: {
                        className: 'datePicker'
                    },
                    popper: {
                        sx: {
                            '& .MuiPickersShortcuts-list': {
                                paddingLeft: '16px',
                                paddingRight: '16px',
                            }
                        }
                    }
                }}
                views={['day', 'month', 'hours', 'minutes']}
                sx={{
                    '& .MuiInputBase-root': {
                        height: '50px',
                        borderRadius: '10px',
                        backgroundColor: 'var(--input-bg)',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '14px',
                        color: 'var(--header)',
                        paddingRight: '16px',

                        '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: '1px solid var(--input-focus-border)',
                            },
                        },

                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'var(--border) !important'
                            }
                        },

                        '& .MuiInputBase-input': {
                            padding: '0 16px',

                            '&::placeholder': {
                                color: 'var(--label)'
                            }
                        },

                        '& .MuiOutlinedInput-notchedOutline': {
                            border: '1px solid var(--border)',
                            transition: 'border-color var(--transition)',

                            '&:hover': {
                                borderColor: 'var(--border) !important'
                            },
                        },

                        '& .MuiButtonBase-root': {
                            color: theme === 'light' ? '#DEE4DF' : 'var(--label)',
                            backgroundColor: 'transparent !important',
                            transition: 'color var(--transition)',

                            '&:hover': {
                                color: theme === 'light' ? 'var(--sidebar)' : '#fff',
                            },

                            '& .MuiTouchRipple-root': {
                                display: 'none'
                            }
                        }
                    }
                }}
            />
        </LocalizationProvider>
    )
}

export default DatePicker;