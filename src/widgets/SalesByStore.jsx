import { useState, useEffect } from 'react';
import { ResponsiveContainer, Tooltip, Pie, PieChart, Cell } from 'recharts';
import { useTheme } from '@contexts/themeContext';
import { useWindowSize } from 'react-use';

const COLORS = [
    { color: 'turquoise', darkAura: '#1B3838', lightAura: '#F4FFFF' },
    { color: 'blue', darkAura: '#14344A', lightAura: '#F1F7FF' },
    { color: 'yellow', darkAura: '#3B300A', lightAura: '#FFFBF0' },
    { color: 'peach', darkAura: '#3B300A', lightAura: '#FFFBF0' },
    { color: 'red', darkAura: '#4E3130', lightAura: '#FFF3F4' }
];

const formatLargeNumber = (number) => {
    if (typeof number === 'string') {
        number = parseFloat(number.replace(/\s/g, ''));
    }
    return new Intl.NumberFormat('fr-FR').format(number);
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

const STORE_NAMES = {
    '1': 'Casablanca',
    '2': 'Rabat',
    '5': 'Tanger',
    '6': 'Marrakech',
    '10': 'Outlet'
};

const SalesByStore = ({ dateRange, storeId }) => {
    const { width } = useWindowSize();
    const { theme } = useTheme();
    const [storeData, setStoreData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStoreData = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            const formattedDateRange = Array.isArray(dateRange) 
                ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                : dateRange;

            formData.append('date_range', formattedDateRange);
            formData.append('store_id', storeId);

            const response = await fetch('https://sales.sketchdesign.ma/fetch_sales_new.php', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.revenue_by_store) {
                const storeDataMap = data.revenue_by_store.reduce((acc, item) => {
                    acc[item.store] = {
                        value: parseInt(item.revenue.replace(/\s/g, '')),
                        percentage: parseFloat(item.percentage)
                    };
                    return acc;
                }, {});

                const formattedData = Object.entries(STORE_NAMES).map(([id, name], index) => {
                    const storeData = storeDataMap[name] || { value: 0, percentage: 0 };
                    return {
                        name,
                        value: storeData.value,
                        percentage: storeData.percentage,
                        index
                    };
                });

                setStoreData(formattedData);
            }
        } catch (error) {
            console.error('Failed to fetch store data:', error);
            const defaultData = Object.entries(STORE_NAMES).map(([id, name], index) => ({
                name,
                value: 0,
                percentage: 0,
                index
            }));
            setStoreData(defaultData);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, [storeId, dateRange]);

    const getTotal = () => {
        return storeData.reduce((acc, curr) => acc + curr.value, 0);
    }

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">CA par magasin</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                        <div className="h-10 bg-[#374151] rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 p-5 h-full xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
            <div className="flex flex-col gap-2.5 xs:flex-row xs:items-center xs:justify-between">
                <h2 className="text-gray-300">Chiffre d'affaires par magasin</h2>
            </div>
            <div className="flex flex-col items-start gap-6 flex-1 md:flex-row md:items-start md:gap-[65px] overflow-hidden">
                <div className="relative shrink-0 min-h-[240px] min-w-[240px] xs:min-w-[294px]
                     xs:min-h-[294px] m-auto md:m-0 md:w-[294px] md:h-[294px]">
                    <ResponsiveContainer width="99%" height="99%">
                        <PieChart>
                            <Pie 
                                data={storeData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={width < 414 ? 118 : 140}
                                innerRadius={95}
                                strokeWidth={0}
                            >
                                {storeData.map((entry, index) => (
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
                            <span className="counter block whitespace-nowrap text-[24px] font-bold text-white">
                                {formatLargeNumber(getTotal())}
                            </span>
                            <span className="block text-[16px] font-medium text-gray-300">DH</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col flex-1 w-full gap-4 overflow-y-auto max-h-[294px] pr-2">
                    {storeData.map((item, index) => (
                        <div key={index} className="flex gap-2.5">
                            <span className="flex items-center justify-center w-[30px] h-[30px] rounded-full mt-1 shrink-0 bg-[#374151]">
                                <span className={`w-[15px] h-[15px] rounded-full bg-${COLORS[index % COLORS.length].color}`}/>
                            </span>
                            <div className="flex flex-col flex-1 gap-1">
                                <p className="flex justify-between font-medium text-[15px] text-gray-300">
                                    <span className="truncate pr-2">{item.name}</span>
                                    <span className="whitespace-nowrap">
                                        {formatLargeNumber(item.value)} DH
                                    </span>
                                </p>
                                <p className="uppercase text-xs text-gray-400">
                                    {item.percentage}%
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SalesByStore;