import { useState, useEffect, useCallback } from 'react';
import StatisticsCard from '@components/StatisticsCard';
import { 
    FaChartLine, 
    FaMoneyBillWave, 
    FaCoins, 
    FaCreditCard, 
    FaMoneyCheck, 
    FaMoneyBill, 
    FaExchangeAlt 
} from 'react-icons/fa';
import Counter from '@components/Counter';

const Statistics = ({ dateRange, storeId = 'all' }) => {
    const [allStats, setAllStats] = useState([
        {
            title: "CHIFFRE D'AFFAIRE",
            icon: FaChartLine,
            value: 0,
            valuePrefix: 'DH',
            data: [],
            type: 'primary',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        },
        {
            title: 'TOTAL ENCAISSÉ',
            icon: FaMoneyBillWave,
            value: 0,
            valuePrefix: 'DH',
            data: [],
            type: 'primary',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        },
        {
            title: 'Reliquats',
            icon: FaCoins,
            value: 0,
            valuePrefix: 'DH',
            data: [],
            type: 'primary',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        },
        {
            title: 'TOTAL CARTE BANCAIRE',
            icon: FaCreditCard,
            value: 0,
            valuePrefix: 'DH',
            type: 'payment',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        },
        {
            title: 'TOTAL CHÈQUE',
            icon: FaMoneyCheck,
            value: 0,
            valuePrefix: 'DH',
            type: 'payment',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        },
        {
            title: 'TOTAL ESPÈCE',
            icon: FaMoneyBill,
            value: 0,
            valuePrefix: 'DH',
            type: 'payment',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        },
        {
            title: 'TOTAL VIREMENT',
            icon: FaExchangeAlt,
            value: 0,
            valuePrefix: 'DH',
            type: 'payment',
            bgColor: 'bg-white',
            iconBg: 'bg-[#F3F3F8]'
        }
    ]);

    // Add loading state
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to clean number strings
    const cleanNumber = useCallback((str) => {
        if (!str) return 0;
        return parseFloat(str.toString().replace(/[^\d.-]/g, '')) || 0;
    }, []);

    // Helper function to get payment total
    const getPaymentTotal = useCallback((data, type) => {
        const payment = data.total_payments?.find(p => p.mode === type);
        return payment ? parseFloat(payment.amount.replace(/[^\d.-]/g, '')) / 100 : 0;
    }, []);

    // Helper function to get chart data
    const getChartData = useCallback((data, type) => {
        if (!data.chart_data) return [];
        switch(type) {
            case 'invoice':
                return data.chart_data.invoice;
            case 'encaisse':
                return data.chart_data.encaisse;
            case 'unpaid':
                return data.chart_data.unpaid;
            default:
                return [];
        }
    }, []);

    useEffect(() => {
        const fetchStatistics = async () => {
            setIsLoading(true);
            try {
                if (!dateRange) return;

                const formData = new FormData();
                const formattedDateRange = Array.isArray(dateRange) 
                    ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                    : dateRange;

                formData.append('date_range', formattedDateRange);
                formData.append('store_id', storeId);

                const response = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_sales_new.php', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.error) {
                    console.error('API Error:', data.error);
                    return;
                }

                // Ensure data.total_payments exists
                const totalPayments = data.total_payments || [];
                // Ensure chart_data exists
                const chartData = data.chart_data || { invoice: [], encaisse: [], unpaid: [] };

                setAllStats(prev => prev.map((stat, index) => {
                    let value = 0;
                    let chartData = [];
                    switch (index) {
                        case 0:
                            value = cleanNumber(data.total_invoice_ttc) || 0;
                            chartData = getChartData(data, 'invoice') || [];
                            break;
                        case 1:
                            value = cleanNumber(data.total_encaisse) || 0;
                            chartData = getChartData(data, 'encaisse') || [];
                            break;
                        case 2:
                            value = cleanNumber(data.total_unpaid) || 0;
                            chartData = getChartData(data, 'unpaid') || [];
                            break;
                        case 3:
                            value = getPaymentTotal(data, 'CB') || 0;
                            break;
                        case 4:
                            value = getPaymentTotal(data, 'CHQ') || 0;
                            break;
                        case 5:
                            value = getPaymentTotal(data, 'LIQ') || 0;
                            break;
                        case 6:
                            value = getPaymentTotal(data, 'VIR') || 0;
                            break;
                        default:
                            value = 0;
                    }
                    return {
                        ...stat,
                        value,
                        data: index < 3 ? chartData : []
                    };
                }));

            } catch (error) {
                console.error('Failed to fetch statistics:', error);
                // Set all values to 0 in case of error
                setAllStats(prev => prev.map(stat => ({
                    ...stat,
                    value: 0,
                    data: []
                })));
            } finally {
                // Add a small delay for smooth transition
                setTimeout(() => setIsLoading(false), 500);
            }
        };

        fetchStatistics();
    }, [dateRange, storeId, cleanNumber, getPaymentTotal, getChartData]);

    // Separate primary and payment stats
    const primaryStats = allStats.filter(stat => stat.type === 'primary');
    const paymentStats = allStats.filter(stat => stat.type === 'payment');

    // Replace the switch statements with a helper function
    const getPaymentGradients = (paymentType) => {
        switch(paymentType) {
            case 'TOTAL CARTE BANCAIRE':
                return {
                    bg: 'from-violet-500/10 via-violet-500/5 to-transparent',
                    icon: 'from-violet-500 to-violet-600',
                    text: 'from-violet-600 to-violet-800'
                };
            case 'TOTAL CHÈQUE':
                return {
                    bg: 'from-cyan-500/10 via-cyan-500/5 to-transparent',
                    icon: 'from-cyan-500 to-cyan-600',
                    text: 'from-cyan-600 to-cyan-800'
                };
            case 'TOTAL ESPÈCE':
                return {
                    bg: 'from-pink-500/10 via-pink-500/5 to-transparent',
                    icon: 'from-pink-500 to-pink-600',
                    text: 'from-pink-600 to-pink-800'
                };
            case 'TOTAL VIREMENT':
                return {
                    bg: 'from-teal-500/10 via-teal-500/5 to-transparent',
                    icon: 'from-teal-500 to-teal-600',
                    text: 'from-teal-600 to-teal-800'
                };
            default:
                return {
                    bg: 'from-gray-500/10 via-gray-500/5 to-transparent',
                    icon: 'from-gray-500 to-gray-600',
                    text: 'from-gray-600 to-gray-800'
                };
        }
    };

    return (
        <div className="space-y-6">
            {/* Primary Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {primaryStats.map((item, index) => (
                    <div key={index} className="w-full">
                        {isLoading ? (
                            <div className="relative p-6 bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                <div className="relative space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-xl bg-gray-200 animate-pulse" />
                                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative p-6 bg-white rounded-xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow">
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${index === 0 
                                    ? 'from-[#599AED]/20 via-[#599AED]/10 to-transparent' // CA
                                    : index === 1 
                                    ? 'from-emerald-500/20 via-emerald-400/10 to-transparent' // Encaissé
                                    : 'from-amber-500/20 via-amber-400/10 to-transparent'} opacity-50`}></div>
                                
                                {/* Content */}
                                <div className="relative">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${index === 0 
                                            ? 'bg-gradient-to-br from-[#599AED] to-[#3B82F6]'
                                            : index === 1 
                                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                                            : 'bg-gradient-to-br from-amber-500 to-amber-600'} shadow-lg`}>
                                            <item.icon className="w-7 h-7 text-white" />
                                        </div>
                                        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-baseline gap-2">
                                        <span className={`text-[32px] font-bold tracking-tight bg-gradient-to-br ${index === 0 
                                            ? 'from-[#599AED] to-[#3B82F6]'
                                            : index === 1 
                                            ? 'from-emerald-600 to-emerald-800'
                                            : 'from-amber-600 to-amber-800'} bg-clip-text text-transparent`}>
                                            {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.value)}
                                        </span>
                                        <span className="text-[20px] font-medium text-gray-500">
                                            {item.valuePrefix}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {paymentStats.map((item, index) => (
                    <div key={index} className="w-full">
                        {isLoading ? (
                            <div className="relative p-4 bg-white rounded-xl shadow-sm overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                                <div className="relative space-y-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-200 animate-pulse" />
                                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                                    </div>
                                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative p-4 bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
                                {/* Background gradient */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${getPaymentGradients(item.title).bg} opacity-50`}></div>
                                
                                {/* Content */}
                                <div className="relative">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br ${getPaymentGradients(item.title).icon} shadow-sm`}>
                                            <item.icon className="w-4 h-4 text-white" />
                                        </div>
                                        <h3 className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-baseline gap-1.5">
                                        <span className={`text-lg font-bold tracking-tight bg-gradient-to-br ${getPaymentGradients(item.title).text} bg-clip-text text-transparent`}>
                                            {new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(item.value)}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500">
                                            {item.valuePrefix}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;

// Add this to your global CSS or tailwind config
const shimmerAnimation = {
    '@keyframes shimmer': {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' }
    },
    '.animate-shimmer': {
        animation: 'shimmer 1.5s infinite'
    }
};