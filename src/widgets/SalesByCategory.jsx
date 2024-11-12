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

// Updated CATEGORY_COLORS with more vibrant colors
const CATEGORY_COLORS = {
    'SALON EN L': '#FF3B30',          // Bright Red
    'SALON EN U': '#007AFF',          // Vivid Blue
    'CANAPE 2 PLACES': '#5856D6',     // Deep Purple
    'CANAPE 3 PLACES': '#FF9500',     // Bright Orange
    'FAUTEUIL': '#4CD964',            // Vibrant Green
    'CHAISE': '#FF2D55',              // Hot Pink
    'TABLE DE SALLE A MANGER': '#5AC8FA', // Sky Blue
    'TABLE BASSE': '#FFCC00',         // Bright Yellow
    'MEUBLES TV': '#FF3B30',          // Bright Red
    'TABLE D\'APPOINT': '#007AFF',    // Vivid Blue
    'BUFFET': '#5856D6',              // Deep Purple
    'CONSOLE': '#FF9500',             // Bright Orange
    'BIBLIOTHEQUE': '#4CD964',        // Vibrant Green
    'LIT': '#FF2D55',                 // Hot Pink
    'TABLE DE CHEVET': '#5AC8FA',     // Sky Blue
    'ENSEMBLE D\'EXTERIEURE': '#FFCC00', // Bright Yellow
    'TRANSAT': '#FF3B30',             // Bright Red
    'TABLE EXTERIEUR': '#007AFF',     // Vivid Blue
    'CHAISE EXTERIEUR': '#5856D6',    // Deep Purple
    'MIROIRS': '#FF9500',             // Bright Orange
    'POUF': '#4CD964',                // Vibrant Green
    'TABLEAUX': '#FF2D55',            // Hot Pink
    'LUMINAIRE-LUXALIGHT': '#5AC8FA', // Sky Blue
    'COUETTES': '#FFCC00',            // Bright Yellow
    'MATELAS': '#FF3B30',             // Bright Red
    'OREILLERS': '#007AFF',           // Vivid Blue
    'TAPIS': '#5856D6'                // Deep Purple
};

// Default color for any category not in the mapping
const DEFAULT_COLOR = '#808080';

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
    const colorScheme = CATEGORY_COLORS[decodeHtmlEntities(item.category)] || DEFAULT_COLOR;

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
                  style={{backgroundColor: theme === 'dark' ? colorScheme : colorScheme}}>
                <span className="w-[7px] h-[7px] rounded-full" 
                      style={{backgroundColor: colorScheme}}/>
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

// Add a function to normalize category names
const normalizeCategory = (category) => {
    return decodeHtmlEntities(category)
        .trim()
        .replace(/\s+/g, ' ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .toUpperCase();
};

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
                const formattedData = data.revenue_by_category
                    .filter(item => {
                        const value = parseInt(item.total_revenue.replace(/\s/g, '').replace(',', '.')) || 0;
                        const normalizedCategory = normalizeCategory(item.category);
                        console.log('Category:', item.category);
                        console.log('Normalized:', normalizedCategory);
                        console.log('Color:', CATEGORY_COLORS[normalizedCategory]);
                        return value > 0;
                    })
                    .map((item, index) => ({
                        category: item.category,
                        normalizedCategory: normalizeCategory(item.category),
                        value: parseInt(item.total_revenue.replace(/\s/g, '').replace(',', '.')) || 0,
                        percentage: item.percentage,
                        index
                    }));

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
                                    activeShape={({ cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill }) => {
                                        return (
                                            <g>
                                                <path 
                                                    d={`M ${cx},${cy} 
                                               L ${cx + Math.cos(startAngle) * (outerRadius + 10)},
                                                 ${cy + Math.sin(startAngle) * (outerRadius + 10)} 
                                               A ${outerRadius + 10},${outerRadius + 10} 0 0 1 
                                                 ${cx + Math.cos(endAngle) * (outerRadius + 10)},
                                                 ${cy + Math.sin(endAngle) * (outerRadius + 10)} Z`}
                                                    fill={fill}
                                                    fillOpacity={0.1}
                                                />
                                                <path
                                                    d={`M ${cx},${cy} 
                                               L ${cx + Math.cos(startAngle) * outerRadius},
                                                 ${cy + Math.sin(startAngle) * outerRadius} 
                                               A ${outerRadius},${outerRadius} 0 0 1 
                                                 ${cx + Math.cos(endAngle) * outerRadius},
                                                 ${cy + Math.sin(endAngle) * outerRadius} Z`}
                                                    fill={fill}
                                                />
                                            </g>
                                        );
                                    }}
                                >
                                    {categoryData.map((item) => (
                                        <Cell 
                                            key={item.category} 
                                            fill={CATEGORY_COLORS[normalizeCategory(item.category)] || DEFAULT_COLOR}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    cursor={false}
                                    isAnimationActive={false}
                                    position={{ y: 0 }}
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            const category = decodeHtmlEntities(payload[0].name);
                                            const value = payload[0].value;
                                            const percentage = ((value / getTotal()) * 100).toFixed(2);
                                            const color = CATEGORY_COLORS[normalizeCategory(category)] || DEFAULT_COLOR;
                                            
                                            return (
                                                <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span 
                                                            className="w-3 h-3 rounded-full shrink-0"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {category}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-baseline gap-2">
                                                        <p className="text-lg font-bold text-gray-900">
                                                            {userRole === 'store_manager' && !isMobile 
                                                                ? '••••• DH'
                                                                : `${new Intl.NumberFormat('fr-FR').format(value)} DH`
                                                            }
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-500">
                                                            ({percentage}%)
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
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

                    {/* Categories List - specific height only for 'all' stores */}
                    <div className={`flex flex-col flex-1 w-full gap-4 overflow-y-auto pr-2
                        ${storeId === 'all' 
                            ? 'md:h-[662px] md:max-h-[662px]' 
                            : 'max-h-[294px]'}`}
                    >
                        {categoryData.map((item) => (
                            <div key={item.category} className="flex gap-3">
                                <span className="flex items-center justify-center w-[30px] h-[30px] rounded-full mt-1 shrink-0 bg-gray-100">
                                    <span 
                                        className="w-[15px] h-[15px] rounded-full"
                                        style={{ 
                                            backgroundColor: CATEGORY_COLORS[normalizeCategory(item.category)] || DEFAULT_COLOR 
                                        }}
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
                                    {/* Progress bar now shows for all views */}
                                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                                        <div 
                                            className="h-full rounded-full transition-all duration-500"
                                            style={{ 
                                                backgroundColor: CATEGORY_COLORS[normalizeCategory(item.category)] || DEFAULT_COLOR,
                                                width: `${((item.value / getTotal()) * 100)}%`
                                            }}
                                        />
                                    </div>
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