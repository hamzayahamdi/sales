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

const SalesByStore = ({ dateRange, storeId }) => {
    const { width } = useWindowSize();
    const { theme } = useTheme();

    // Use the revenue_by_store data from your API response
    // Format and display it similar to SalesByCategory
    // ... rest of the component implementation

    return (
        <div className="flex flex-col gap-4 p-5 h-full xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
            <div className="flex flex-col gap-2.5 xs:flex-row xs:items-center xs:justify-between">
                <h2 className="text-gray-300">Chiffre d'affaires par magasin</h2>
            </div>
            {/* Rest of your component JSX */}
        </div>
    );
};

export default SalesByStore; 