// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';

// hooks
import { useState, useEffect } from 'react';
import { useWindowSize } from 'react-use';
import dayjs from 'dayjs';

const SalesTeamLeaderboard = ({ storeId = 'all', dateRange }) => {
    const { width } = useWindowSize();
    const [salesTeam, setSalesTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const formatDateRange = (dateRange) => {
        if (Array.isArray(dateRange)) {
            // If dateRange is an array of dayjs objects
            return `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`;
        } else if (typeof dateRange === 'string') {
            // If dateRange is already a string in correct format
            return dateRange;
        }
        // Fallback to today's date
        const today = dayjs();
        return `${today.format('DD/MM/YYYY')} - ${today.format('DD/MM/YYYY')}`;
    };

    const fetchSalesTeam = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('date_range', formatDateRange(dateRange));
            formData.append('store_id', storeId);

            const response = await fetch('https://sales.sketchdesign.ma/fetch_sales_new.php', {
                method: 'POST',
                body: formData
            });

            // Check if response is ok and content type is JSON
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                console.error('Received non-JSON response:', await response.text());
                throw new Error('Received non-JSON response from server');
            }

            const data = await response.json();
            
            if (data.error) {
                console.error('API Error:', data.error);
                setSalesTeam([]);
                return;
            }
            
            if (data.commercial_ranking) {
                const formattedTeam = data.commercial_ranking.map((member, index) => ({
                    id: index + 1,
                    name: member.name,
                    sales_count: member.total_sales,
                    total_sales: member.revenue.replace(/\s/g, ''),
                    avg_basket: member.avg_basket.replace(/\s/g, ''),
                    store: member.magasin,
                    rank: index + 1
                }));

                setSalesTeam(formattedTeam);
            } else {
                setSalesTeam([]);
            }
        } catch (error) {
            console.error('Failed to fetch sales team data:', error);
            if (error.message.includes('JSON')) {
                console.error('Invalid JSON response from server');
            }
            setSalesTeam([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesTeam();
    }, [storeId, dateRange]);

    const getMobileColumns = () => [
        {
            title: 'VENDEUR',
            dataIndex: 'name',
            key: 'name',
            width: '60%',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 shrink-0">
                        <span className="font-medium text-xs">{record.rank}</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-medium truncate uppercase">{text}</span>
                        <span className="text-xs text-gray-500 truncate">{record.store}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'TOTAL TTC',
            dataIndex: 'total_sales',
            key: 'total_sales',
            width: '40%',
            render: (value) => (
                <span className="font-medium">
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        }
    ];

    const getDesktopColumns = () => [
        {
            title: 'RANK',
            dataIndex: 'rank',
            key: 'rank',
            width: '10%',
            render: (value) => (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                    <span className="font-medium">{value}</span>
                </div>
            )
        },
        {
            title: 'VENDEUR',
            dataIndex: 'name',
            key: 'name',
            width: '30%',
            render: (text, record) => (
                <div className="flex flex-col">
                    <span className="font-medium uppercase">{text}</span>
                    <span className="text-xs text-gray-500">{record.store}</span>
                </div>
            )
        },
        {
            title: 'VENTES',
            dataIndex: 'sales_count',
            key: 'sales_count',
            width: '15%',
            render: (value) => (
                <span className="font-medium">{new Intl.NumberFormat('en-US').format(value)}</span>
            )
        },
        {
            title: 'PANIER MOYEN',
            dataIndex: 'avg_basket',
            key: 'avg_basket',
            width: '20%',
            render: (value) => (
                <span className="font-medium">
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        },
        {
            title: 'TOTAL TTC',
            dataIndex: 'total_sales',
            key: 'total_sales',
            width: '25%',
            render: (value) => (
                <span className="font-medium">
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        }
    ];

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Classement Vendeurs</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[400px] p-4 xs:p-5 bg-[#1F2937] shadow-lg rounded-xl">
            <h2 className="text-lg font-semibold mb-3 text-gray-300">Classement Vendeurs</h2>
            <div className="flex-1 overflow-hidden">
                <BasicTable 
                    dataSource={salesTeam}
                    columns={width < 768 ? getMobileColumns() : getDesktopColumns()}
                    rowKey="id"
                    showSorterTooltip={false}
                    pagination={false}
                    size="small"
                    className="leaderboard-table h-full dark"
                    scroll={{ y: 260 }}
                />
            </div>
        </div>
    );
};

export default SalesTeamLeaderboard; 