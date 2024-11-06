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

    // Helper function to clean number strings
    const cleanNumber = useCallback((str) => {
        if (!str) return 0;
        return parseInt(str.toString().replace(/[.,\s]/g, '') || '0', 10);
    }, []);

    // Helper function to get payment total
    const getPaymentTotal = useCallback((data, type) => {
        const payment = data.total_payments?.find(p => p.mode === type);
        return payment ? Math.round(parseInt(payment.amount.replace(/[.,\s]/g, '') || '0', 10) / 100) : 0;
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
            if (!dateRange) return;

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
            }
        };

        fetchStatistics();
    }, [dateRange, storeId, cleanNumber, getPaymentTotal, getChartData]);

    // Separate primary and payment stats
    const primaryStats = allStats.filter(stat => stat.type === 'primary');
    const paymentStats = allStats.filter(stat => stat.type === 'payment');

    return (
        <div className="space-y-4">
            {/* Primary Stats - Three main cards in one line on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {primaryStats.map((item, index) => (
                    <div key={index} className="w-full">
                        <StatisticsCard 
                            data={{
                                ...item,
                                bgColor: 'bg-white',
                                iconBgColor: 'bg-[#F3F3F8]',
                                valueClass: 'text-[32px]',
                                prefixClass: 'text-[20px]'
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Payment Stats - Remain in their original layout */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {paymentStats.map((item, index) => (
                    <div key={index} className="col-span-1">
                        <StatisticsCard 
                            data={{
                                ...item,
                                bgColor: 'bg-white',
                                iconBgColor: 'bg-[#F3F3F8]'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Statistics;