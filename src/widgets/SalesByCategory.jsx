// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import {ResponsiveContainer, Tooltip, Pie, PieChart, Cell} from 'recharts';
import { FaChartPie } from 'react-icons/fa';

// hooks
import {useState, useEffect} from 'react';
import {useTheme} from '@contexts/themeContext';
import {useWindowSize} from 'react-use';
import dayjs from 'dayjs';

// constants
const PERIODS = [
    { value: 'jours', label: 'Jours' },
    { value: 'semaines', label: 'Semaines' },
    { value: 'mois', label: 'Mois' }
];

// Colors for categories
const COLORS = [
    { color: 'turquoise', darkAura: '#1B3838', lightAura: '#F4FFFF' },
    { color: 'blue', darkAura: '#14344A', lightAura: '#F1F7FF' },
    { color: 'yellow', darkAura: '#3B300A', lightAura: '#FFFBF0' },
    { color: 'peach', darkAura: '#3B300A', lightAura: '#FFFBF0' },
    { color: 'red', darkAura: '#4E3130', lightAura: '#FFF3F4' }
];

const formatLargeNumber = (number) => {
    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
};

const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
        return (
            <div className="basic-tooltip">
                {formatLargeNumber(payload[0].value)} DH
            </div>
        );
    }
    return null;
}

const LegendItem = ({item, total}) => {
    const {theme} = useTheme();
    const colorIndex = item.index % COLORS.length;
    const colorScheme = COLORS[colorIndex];

    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(2) : 0;
    
    const categoryName = decodeURIComponent(item.category)
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/\s+/g, ' ')
        .trim();

    return (
        <div className="flex gap-2.5">
            <span className="flex items-center justify-center w-[15px] h-[15px] rounded-full mt-1 shrink-0"
                  style={{backgroundColor: theme === 'dark' ? colorScheme.darkAura : colorScheme.lightAura}}>
                <span className={`w-[7px] h-[7px] rounded-full bg-${colorScheme.color}`}/>
            </span>
            <div className="flex flex-col flex-1 gap-1">
                <p className="flex justify-between font-medium text-[15px] text-header">
                    <span className="truncate pr-2">{categoryName}</span>
                    <span className="whitespace-nowrap">
                        ({percentage}%) {new Intl.NumberFormat('fr-FR').format(item.value)} DH
                    </span>
                </p>
                <p className="uppercase text-xs text-label">
                    {item.percentage}
                </p>
            </div>
        </div>
    );
};

const decodeHtmlEntities = (text) => {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    let decodedText = textArea.value
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&');
        
    // Special case for "ENSEMBLE D'EXTERIEUR"
    if (decodedText.toUpperCase().includes("ENSEMBLE D'EXTERIEUR")) {
        decodedText = decodedText.replace(/ENSEMBLE D'EXTERIEUR/i, "ENSEMBLE D'EXTÉRIEURE");
    }
    
    return decodedText;
};

const SalesByCategory = ({ storeId = 'all', dateRange }) => {
    const {width} = useWindowSize();
    const [period, setPeriod] = useState(PERIODS[0]);
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCategoryData = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            // Format date range if it's an array
            const formattedDateRange = Array.isArray(dateRange) 
                ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                : dateRange;

            formData.append('date_range', formattedDateRange);
            formData.append('store_id', storeId);

            const response = await fetch('https://sales.sketchdesign.ma/fetch_sales_new.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                mode: 'cors',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Full API Response:', data);
            console.log('Revenue by category data:', data.revenue_by_category);

            if (data.revenue_by_category) {
                console.log('Raw category data:', data.revenue_by_category);
                const formattedData = data.revenue_by_category
                    .filter(item => {
                        const value = parseInt(item.total_revenue.replace(/\s/g, '').replace(',', '.')) || 0;
                        console.log('Processing category:', item.category, 'value:', value); // Debug log
                        return value > 0;
                    })
                    .map((item, index) => ({
                        category: item.category,
                        value: parseInt(item.total_revenue.replace(/\s/g, '').replace(',', '.')) || 0,
                        percentage: item.percentage,
                        index
                    }));

                console.log('Formatted category data:', formattedData);
                setCategoryData(formattedData);
            } else {
                console.log('No revenue_by_category data in response:', data);
                setCategoryData([]);
            }
        } catch (error) {
            console.error('Failed to fetch category data:', error);
            setCategoryData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategoryData();
    }, [storeId, dateRange]);

    const getTotal = () => {
        return categoryData.reduce((acc, curr) => acc + curr.value, 0);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">CA par catégorie</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
            {/* Title with glassy parallelogram effect */}
            <div className="relative mb-4">
                <div 
                    className="absolute inset-0 bg-white/5 backdrop-blur-[2px] transform skew-x-[-20deg] rounded 
                        shadow-[0_8px_32px_rgba(31,41,55,0.5)] 
                        after:absolute after:inset-0 after:bg-gradient-to-r 
                        after:from-white/10 after:to-transparent after:rounded
                        before:absolute before:inset-0 before:bg-blue-500/20 before:blur-[15px] before:rounded"
                />
                <h2 className="relative z-10 px-6 py-2.5 flex items-center gap-2 text-xl font-semibold text-white">
                    <FaChartPie className="text-lg text-blue-400" />
                    CA par catégorie
                </h2>
            </div>
            
            {/* Content with conditional layout */}
            <div className={`flex flex-col items-start gap-6 flex-1 
                ${storeId === 'all' ? 'md:flex-row md:items-center' : 'md:flex-row md:items-start'}
                md:gap-[65px] overflow-hidden`}
            >
                {/* Chart Section */}
                <div className={`relative shrink-0 min-h-[240px] min-w-[240px] 
                    xs:min-w-[294px] xs:min-h-[294px] m-auto md:m-0 
                    md:w-[294px] md:h-[294px]
                    ${storeId === 'all' ? 'md:self-center' : ''}`}
                >
                    <ResponsiveContainer width="99%" height="99%">
                        <PieChart>
                            <Pie 
                                data={categoryData}
                                dataKey="value"
                                nameKey="category"
                                cx="50%"
                                cy="50%"
                                outerRadius={width < 414 ? 118 : 140}
                                innerRadius={95}
                                strokeWidth={0}
                            >
                                {categoryData.map((item, index) => (
                                    <Cell 
                                        key={index} 
                                        fill={`var(--${COLORS[index % COLORS.length].color})`}
                                    />
                                ))}
                            </Pie>
                            <Tooltip 
                                cursor={false} 
                                content={<CustomTooltip/>}
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: '1px solid #374151',
                                    color: '#E5E7EB'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center m-auto justify-center">
                            <span className="counter block whitespace-nowrap text-[32px] font-bold text-white">
                                {formatLargeNumber(getTotal())}
                            </span>
                            <span className="block text-[18px] font-medium text-gray-300">DH</span>
                        </div>
                    </div>
                </div>

                {/* Categories List */}
                <div className={`flex flex-col flex-1 w-full gap-4 overflow-y-auto overscroll-behavior-contain pr-2
                    ${storeId === 'all' ? 'md:max-h-[500px]' : 'max-h-[294px]'}`}
                >
                    {categoryData.map((item, index) => (
                        <div key={index} className="flex gap-3">
                            <span className="flex items-center justify-center w-[30px] h-[30px] rounded-full mt-1 shrink-0 bg-[#374151]">
                                <span className={`w-[15px] h-[15px] rounded-full bg-${COLORS[index % COLORS.length].color}`}/>
                            </span>
                            <div className="flex flex-col flex-1 gap-1.5">
                                <p className="flex justify-between font-medium text-[15px] text-gray-300">
                                    <span className="truncate pr-2">{decodeHtmlEntities(item.category)}</span>
                                    <span className="whitespace-nowrap">
                                        {new Intl.NumberFormat('en-US').format(item.value)} DH
                                    </span>
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="uppercase text-xs text-gray-400">
                                        {((item.value / getTotal()) * 100).toFixed(2)}%
                                    </p>
                                </div>
                                {storeId === 'all' && (
                                    <div className="w-full bg-[#374151] rounded-full h-1.5 mt-1">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{
                                                width: `${(item.value / getTotal()) * 100}%`,
                                                backgroundColor: `var(--${COLORS[index % COLORS.length].color})`
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesByCategory;