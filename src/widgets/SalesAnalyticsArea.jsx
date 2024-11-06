// React and hooks
import { useState, useEffect, useCallback } from 'react';
import { useWindowSize } from 'react-use';
import { FaChartArea } from 'react-icons/fa';

// Components
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FormControl, Select, MenuItem } from '@mui/material';

// Date handling
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import weekday from 'dayjs/plugin/weekday';

// Register the plugin
dayjs.extend(isSameOrBefore);
dayjs.extend(weekday);

// Constants
const PERIODS = [
    { value: 'jours', label: 'Jours' },
    { value: 'semaines', label: 'Semaines' },
    { value: 'mois', label: 'Mois' }
];

const SalesAnalyticsArea = ({ dateRange, storeId }) => {
    const { width } = useWindowSize();
    const [salesData, setSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [period, setPeriod] = useState(PERIODS[0]);

    const formatValue = useCallback((value) => {
        return new Intl.NumberFormat('fr-FR', {
            notation: 'compact',
            compactDisplay: 'short'
        }).format(value);
    }, []);

    const getWeekDates = (weekNumber) => {
        const year = dayjs().year();
        console.log('Getting week dates:', { weekNumber, year });
        
        const startOfWeek = dayjs().year(year).week(weekNumber).weekday(1); // Monday
        const endOfWeek = dayjs().year(year).week(weekNumber).weekday(7); // Sunday
        
        const result = {
            start: startOfWeek.format('DD/MM'),
            end: endOfWeek.format('DD/MM')
        };
        
        console.log('Week dates result:', {
            weekNumber,
            startOfWeek: startOfWeek.format('YYYY-MM-DD'),
            endOfWeek: endOfWeek.format('YYYY-MM-DD'),
            formatted: result
        });
        
        return result;
    };

    const getDateRange = (period) => {
        const today = dayjs();
        const currentYear = today.year();
        
        switch(period.value) {
            case 'jours':
                // Last 28 days
                return `${today.subtract(27, 'days').format('DD/MM/YYYY')} - ${today.format('DD/MM/YYYY')}`;
            case 'semaines':
                // From start of year to today
                return `01/01/${currentYear} - ${today.format('DD/MM/YYYY')}`;
            case 'mois':
                // Full current year
                return `01/01/${currentYear} - 31/12/${currentYear}`;
            default:
                return `${today.subtract(27, 'days').format('DD/MM/YYYY')} - ${today.format('DD/MM/YYYY')}`;
        }
    };

    const formatDate = (date, periodType) => {
        switch(periodType) {
            case 'mois':
                // Convert to abbreviated month name (e.g., "Jan", "Fév", etc.)
                const monthNames = [
                    'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                    'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
                ];
                const [month] = date.split('/');
                return monthNames[parseInt(month) - 1];
            case 'semaines':
                // Format as "S1", "S2", etc.
                const weekNumber = date.split('/')[0];
                return `S${weekNumber.padStart(2, '0')}`;
            default:
                // Format as "DD/MM"
                return date;
        }
    };

    const sortData = (data, periodType) => {
        return data.sort((a, b) => {
            if (periodType === 'mois') {
                // Create a month order map starting from January
                const monthOrder = {
                    'Jan': 0,
                    'Fév': 1,
                    'Mar': 2,
                    'Avr': 3,
                    'Mai': 4,
                    'Juin': 5,
                    'Juil': 6,
                    'Août': 7,
                    'Sep': 8,
                    'Oct': 9,
                    'Nov': 10,
                    'Déc': 11
                };
                return monthOrder[a.date] - monthOrder[b.date];
            } else if (periodType === 'semaines') {
                // Sort by week number
                const weekA = parseInt(a.date.substring(1));
                const weekB = parseInt(b.date.substring(1));
                return weekA - weekB;
            }
            // Sort by date for daily view
            return dayjs(a.date, 'DD/MM').valueOf() - dayjs(b.date, 'DD/MM').valueOf();
        });
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const dateRange = getDateRange(period);
            const formData = new FormData();
            formData.append('date_range', dateRange);
            formData.append('store_id', storeId);
            formData.append('fetch_daily', 'true');
            formData.append('daily_only', 'true');
            formData.append('period', period.value);

            const response = await fetch('https://sales.sketchdesign.ma/fetch_sales_new.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.daily_data) {
                let formattedData;
                if (period.value === 'mois') {
                    // Create array with all months of the year
                    const monthNames = [
                        'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin',
                        'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'
                    ];
                    
                    // Initialize all months with 0
                    const monthlyData = monthNames.reduce((acc, month) => {
                        acc[month] = 0;
                        return acc;
                    }, {});

                    // Fill in actual data
                    Object.entries(data.daily_data).forEach(([date, value]) => {
                        const monthIndex = parseInt(date.split('/')[1]) - 1; // Get month index (0-11)
                        const monthKey = monthNames[monthIndex];
                        monthlyData[monthKey] += parseInt(value.replace(/\s/g, '').replace(',', '.')) || 0;
                    });

                    // Convert to array format
                    formattedData = monthNames.map(month => ({
                        date: month,
                        value: monthlyData[month]
                    }));
                } else if (period.value === 'semaines') {
                    console.group('Weekly Data Processing');
                    console.log('Raw data:', data.daily_data);
                    
                    // Get current year for date processing
                    const currentYear = dayjs().year();
                    
                    const weeklyData = {};
                    Object.entries(data.daily_data).forEach(([date, value]) => {
                        try {
                            // Split the date and create a safe date string
                            const [day, month] = date.split('/');
                            // Add current year to the date
                            const dateString = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                            
                            console.log('Processing date:', { 
                                day, 
                                month, 
                                year: currentYear, 
                                originalDate: date,
                                constructedDate: dateString 
                            });
                            
                            const dateObj = dayjs(dateString);
                            
                            console.log('Date object:', {
                                dateString,
                                isValid: dateObj.isValid(),
                                weekNumber: dateObj.isValid() ? dateObj.week() : 'Invalid',
                                originalValue: value
                            });
                            
                            if (dateObj.isValid()) {
                                const weekNumber = dateObj.week();
                                if (!weeklyData[weekNumber]) {
                                    weeklyData[weekNumber] = 0;
                                }
                                const parsedValue = parseInt(value.replace(/\s/g, '').replace(',', '.')) || 0;
                                weeklyData[weekNumber] += parsedValue;
                                
                                console.log(`Week ${weekNumber}: Added ${parsedValue}, Total: ${weeklyData[weekNumber]}`);
                            } else {
                                console.warn('Invalid date:', date, 'Constructed date:', dateString);
                            }
                        } catch (error) {
                            console.error('Error processing date:', {
                                date,
                                value,
                                error: error.message,
                                stack: error.stack
                            });
                        }
                    });

                    console.log('Weekly data accumulated:', weeklyData);

                    // Sort the weeks in ascending order
                    formattedData = Object.entries(weeklyData)
                        .filter(([weekNum]) => !isNaN(parseInt(weekNum)))
                        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                        .map(([weekNum, value]) => {
                            const formatted = {
                                date: `S${weekNum.toString().padStart(2, '0')}`,
                                value: value
                            };
                            console.log('Formatted week entry:', formatted);
                            return formatted;
                        });

                    console.log('Final formatted data:', formattedData);
                    console.groupEnd();
                } else {
                    // Daily data
                    formattedData = Object.entries(data.daily_data).map(([date, value]) => ({
                        date: formatDate(date, period.value),
                        value: parseInt(value.replace(/\s/g, '').replace(',', '.')) || 0
                    }));
                }

                // Sort the data
                const sortedData = sortData(formattedData, period.value);
                setSalesData(sortedData);
            } else {
                setSalesData([]);
            }
        } catch (error) {
            console.error('Failed to fetch sales analytics:', error);
            setSalesData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [storeId, period.value]);

    const formatDateWithDay = (dateStr) => {
        try {
            // Convert DD/MM format to a valid date string with current year
            const [day, month] = dateStr.split('/');
            const currentYear = dayjs().year();
            // Ensure month and day are properly padded with zeros
            const paddedMonth = month.padStart(2, '0');
            const paddedDay = day.padStart(2, '0');
            const date = dayjs(`${currentYear}-${paddedMonth}-${paddedDay}`);
            
            // Check if date is valid before formatting
            if (date.isValid()) {
                // Format to show "Vendredi 03/11" (Friday 03/11)
                return date.format('dddd DD/MM');
            }
            // Return original string if date is invalid
            return dateStr;
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateStr;
        }
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let displayLabel = label;
            if (period?.value === 'semaines') {
                const weekNum = parseInt(label.substring(1));
                const { start, end } = getWeekDates(weekNum);
                displayLabel = `${label} (${start} → ${end})`;
            } else if (period?.value === 'jours') {
                // Only format for daily view
                displayLabel = formatDateWithDay(label);
            }

            return (
                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-600">{displayLabel}</p>
                    <p className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat('en-US').format(payload[0].value)} DH
                    </p>
                </div>
            );
        }
        return null;
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">CA Analytics</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 xs:p-5 bg-white shadow-lg rounded-xl">
            {/* Title and Period Selector */}
            <div className="flex items-center justify-between mb-6">
                {/* Title */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#599AED]/10">
                        <FaChartArea className="w-5 h-5 text-[#599AED]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">CA Analytics</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble des ventes</p>
                    </div>
                </div>

                {/* Period Selector */}
                <div className="min-w-[120px]">
                    <FormControl fullWidth size="small">
                        <Select
                            value={period.value}
                            onChange={(e) => setPeriod(PERIODS.find(p => p.value === e.target.value))}
                            sx={{
                                height: '36px',
                                backgroundColor: '#599AED',
                                color: '#ffffff',
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                                '&:hover': {
                                    backgroundColor: '#4080d4',
                                },
                                '&.Mui-focused': {
                                    backgroundColor: '#4080d4',
                                },
                                '& .MuiSvgIcon-root': {
                                    color: '#ffffff',
                                }
                            }}
                            MenuProps={{
                                PaperProps: {
                                    sx: {
                                        backgroundColor: '#599AED',
                                        border: 'none',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
                                        '& .MuiMenuItem-root': {
                                            color: '#ffffff',
                                            '&:hover': {
                                                backgroundColor: '#4080d4',
                                            },
                                            '&.Mui-selected': {
                                                backgroundColor: '#4080d4',
                                            }
                                        }
                                    }
                                }
                            }}
                        >
                            {PERIODS.map((option) => (
                                <MenuItem 
                                    key={option.value} 
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
            </div>

            {/* Chart with explicit height */}
            <div className="flex-1 min-h-[300px] w-full">
                <ResponsiveContainer width="99%" height="99%">
                    <BarChart 
                        data={salesData} 
                        margin={{ 
                            top: 10, 
                            right: 10, 
                            left: width < 768 ? 0 : 10,
                            bottom: 0 
                        }}
                        barSize={width < 768 ? 20 : 30}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#599AED" stopOpacity={1}/>
                                <stop offset="100%" stopColor="#599AED" stopOpacity={0.6}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid 
                            strokeDasharray="3 3" 
                            vertical={false}
                            stroke="#E5E7EB"
                        />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false}
                            axisLine={false}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text 
                                            x={0} 
                                            y={0} 
                                            dy={16} 
                                            textAnchor="middle" 
                                            style={{ 
                                                fill: '#000000',
                                                fontWeight: '500',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {payload.value}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <YAxis 
                            tickLine={false}
                            axisLine={false}
                            tick={(props) => {
                                const { x, y, payload } = props;
                                return (
                                    <g transform={`translate(${x},${y})`}>
                                        <text 
                                            x={-10} 
                                            y={0} 
                                            textAnchor="end" 
                                            style={{ 
                                                fill: '#000000',
                                                fontWeight: '500',
                                                fontSize: '12px'
                                            }}
                                        >
                                            {new Intl.NumberFormat('fr-FR', {
                                                notation: 'compact',
                                                compactDisplay: 'short'
                                            }).format(payload.value)}
                                        </text>
                                    </g>
                                );
                            }}
                        />
                        <Tooltip 
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(89, 154, 237, 0.1)' }}
                        />
                        <Bar
                            dataKey="value"
                            fill="url(#colorValue)"
                            radius={[4, 4, 0, 0]}
                            animationBegin={0}
                            animationDuration={1500}
                            animationEasing="ease-out"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SalesAnalyticsArea;