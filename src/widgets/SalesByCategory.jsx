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
    { color: '#5CCFB9', name: 'turquoise' }, // Turquoise for Salon en L
    { color: '#599AED', name: 'blue' },      // Blue for Chaise
    { color: '#FFB347', name: 'yellow' },    // Yellow for Ensemble d'Extérieure
    { color: '#FF9F7B', name: 'peach' },     // Peach for Table Basse
    { color: '#FF6B6B', name: 'red' }        // Red for Table de Salle à Manger
];

const formatLargeNumber = (number) => {
    if (number >= 1000000) {
        return `${(number / 1000000).toFixed(1)}M`;
    } else if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toFixed(2);
};

const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-3">
                <div className="text-white font-medium">
                    {new Intl.NumberFormat('fr-FR', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                    }).format(payload[0].value)} DH
                </div>
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
                        ({percentage}%) {new Intl.NumberFormat('fr-FR', { 
                            minimumFractionDigits: 2, 
                            maximumFractionDigits: 2 
                        }).format(item.value)} DH
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

const GlobalStyle = () => (
    <style>
        {`
            .space-y-6 .px-4 .grid .flex-col .md\\:items-center .md\\:self-center .justify-center .justify-center .counter-wrapper span {
                color: #111827 !important;
            }
        `}
    </style>
);

const SalesByCategory = ({ storeId = 'all', dateRange }) => {
    const {width} = useWindowSize();
    const [period, setPeriod] = useState(PERIODS[0]);
    const [categoryData, setCategoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userRole = localStorage.getItem('userRole');
    const isMobile = width < 768;

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

            const response = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_sales_new.php', {
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
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">CA par catégorie</h2>
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
        <>
            <GlobalStyle />
            <div className="flex flex-col h-full p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                {/* Updated Title Section */}
                <div className="flex items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#599AED]/10">
                            <FaChartPie className="w-5 h-5 text-[#599AED]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">CA par catégorie</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Répartition des ventes par catégorie</p>
                        </div>
                    </div>
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
                                            fill={COLORS[index % COLORS.length].color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    cursor={false} 
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#599AED] p-3 rounded-lg shadow-lg">
                                                    <p className="text-lg font-bold text-white">
                                                        {userRole === 'store_manager' && !isMobile 
                                                            ? '••••• DH'
                                                            : `${new Intl.NumberFormat('fr-FR', { 
                                                                minimumFractionDigits: 2, 
                                                                maximumFractionDigits: 2 
                                                            }).format(payload[0].value)} DH`
                                                        }
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                    contentStyle={{
                                        backgroundColor: '#599AED',
                                        border: 'none',
                                        color: '#ffffff',
                                        borderRadius: '8px',
                                        padding: '12px',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)'
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center m-auto justify-center">
                                <div className="counter-wrapper">
                                    <span className="counter block whitespace-nowrap text-[32px] font-bold">
                                        {userRole === 'store_manager' && !isMobile 
                                            ? '•••••' 
                                            : formatLargeNumber(getTotal())
                                        }
                                    </span>
                                </div>
                                <span className="block text-[18px] font-medium text-gray-500">
                                    DH
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Categories List - consistent height across all views on mobile */}
                    <div className={`flex flex-col flex-1 w-full gap-4 overflow-y-auto pr-2
                        max-h-[294px] md:max-h-[${storeId === 'all' ? '400px' : '294px'}]`}
                    >
                        {categoryData.map((item, index) => (
                            <div key={index} className="flex gap-3">
                                <span className="flex items-center justify-center w-[30px] h-[30px] rounded-full mt-1 shrink-0 bg-gray-100">
                                    <span 
                                        className="w-[15px] h-[15px] rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length].color }}
                                    />
                                </span>
                                <div className="flex flex-col flex-1 gap-1.5">
                                    <p className="flex justify-between font-medium text-[15px] text-gray-900">
                                        <span className="truncate pr-2">{decodeHtmlEntities(item.category)}</span>
                                        <span className="whitespace-nowrap">
                                            {userRole === 'store_manager' && !isMobile 
                                                ? '••••• DH'
                                                : `${new Intl.NumberFormat('fr-FR', { 
                                                    minimumFractionDigits: 2, 
                                                    maximumFractionDigits: 2 
                                                }).format(item.value)} DH`
                                            }
                                        </span>
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="uppercase text-xs text-gray-500">
                                            {((item.value / getTotal()) * 100).toFixed(2)}%
                                        </p>
                                    </div>
                                    {storeId === 'all' && (
                                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                            <div 
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{ backgroundColor: COLORS[index % COLORS.length].color }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SalesByCategory;