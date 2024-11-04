import { useState, useEffect } from 'react';
import { useTheme } from '@contexts/themeContext';
import { FaStore } from 'react-icons/fa';

const COLORS = [
    '#3B82F6', // bright blue
    '#22C55E', // bright green
    '#F59E0B', // bright amber
    '#EC4899', // bright pink
    '#8B5CF6'  // bright purple
];

const formatNumber = (number) => {
    if (number >= 1000000) {
        return `${Math.floor(number / 100000) / 10}M`;
    }
    if (number >= 1000) {
        return `${(number / 1000).toFixed(1)}K`;
    }
    return number.toString();
};

const StoreCard = ({ store }) => {
    const percentage = store.percentage;
    
    return (
        <div className="bg-[#111827] rounded-lg p-3.5 relative overflow-hidden">
            {/* Background progress bar */}
            <div 
                className="absolute left-0 bottom-0 h-full transition-all duration-1000 opacity-25"
                style={{ 
                    width: `${percentage}%`,
                    backgroundColor: store.color
                }}
            />
            
            {/* Content */}
            <div className="relative z-10">
                <div className="flex justify-between items-center">
                    <h3 className="text-gray-200 text-xs font-medium">{store.name}</h3>
                    <span className="text-[10px] text-gray-400 bg-[#1F2937] px-2 py-0.5 rounded-full">
                        {percentage.toFixed(1)}%
                    </span>
                </div>
                <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-bold" style={{ color: store.color }}>
                        {formatNumber(store.value)}
                    </span>
                    <span className="text-[10px] text-gray-400">DH</span>
                </div>
            </div>
        </div>
    );
};

const SalesByStore = ({ dateRange, storeId }) => {
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
                const formattedData = data.revenue_by_store
                    .map((item, index) => ({
                        name: item.store,
                        value: parseInt(item.revenue.replace(/\s/g, '')),
                        percentage: parseFloat(item.percentage),
                        color: COLORS[index % COLORS.length]
                    }))
                    .sort((a, b) => b.value - a.value);
                setStoreData(formattedData);
            }
        } catch (error) {
            console.error('Failed to fetch store data:', error);
            setStoreData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStoreData();
    }, [storeId, dateRange]);

    if (isLoading) {
        return (
            <div className="flex flex-col h-[500px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">CA par magasin</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-3 w-full">
                        <div className="h-14 bg-[#374151] rounded-lg w-full"></div>
                        <div className="h-14 bg-[#374151] rounded-lg w-full"></div>
                        <div className="h-14 bg-[#374151] rounded-lg w-full"></div>
                        <div className="h-14 bg-[#374151] rounded-lg w-full"></div>
                        <div className="h-14 bg-[#374151] rounded-lg w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
            {/* Title */}
            <div className="relative mb-4">
                <div 
                    className="absolute inset-0 bg-white/5 backdrop-blur-[2px] transform skew-x-[-20deg] rounded 
                        shadow-[0_8px_32px_rgba(31,41,55,0.5)] 
                        after:absolute after:inset-0 after:bg-gradient-to-r 
                        after:from-white/10 after:to-transparent after:rounded
                        before:absolute before:inset-0 before:bg-blue-500/20 before:blur-[15px] before:rounded"
                />
                <h2 className="relative z-10 px-6 py-2.5 flex items-center gap-2 text-xl font-semibold text-white">
                    <FaStore className="text-lg text-blue-400" />
                    CA par magasin
                </h2>
            </div>

            {/* Content */}
            <div className="flex-1 grid gap-2 auto-rows-min overflow-y-auto">
                {storeData.map((store, index) => (
                    <StoreCard 
                        key={index} 
                        store={store}
                    />
                ))}
            </div>
        </div>
    );
};

export default SalesByStore;
