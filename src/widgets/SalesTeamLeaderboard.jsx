// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';

// hooks
import { useState, useEffect, useMemo } from 'react';
import { useWindowSize } from 'react-use';
import dayjs from 'dayjs';
import { FaSearch, FaFileExport, FaUsers } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const SalesTeamLeaderboard = ({ storeId = 'all', dateRange }) => {
    const { width } = useWindowSize();
    const [salesTeam, setSalesTeam] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                    {record.rank <= 3 && (
                        <div className={`w-6 h-6 flex items-center justify-center rounded-full font-bold text-xs
                            ${record.rank === 1 ? 'bg-[#22c55e]/10 text-[#22c55e]' : 
                              record.rank === 2 ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 
                              'bg-[#f59e0b]/10 text-[#f59e0b]'}
                        `}>
                            #{record.rank}
                        </div>
                    )}
                    <div className="flex flex-col min-w-0">
                        <span className={`font-medium truncate uppercase ${record.rank <= 3 ? 'text-white' : ''}`}>
                            {text}
                        </span>
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
            render: (value, record) => (
                <span className={`font-medium ${record.rank <= 3 ? 'text-white' : ''}`}>
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        }
    ];

    const getDesktopColumns = () => [
        {
            title: 'VENDEUR',
            dataIndex: 'name',
            key: 'name',
            width: '35%',
            render: (text, record) => (
                <div className="flex items-center gap-3">
                    {record.rank <= 3 && (
                        <div className={`w-7 h-7 flex items-center justify-center rounded-full font-bold text-sm
                            ${record.rank === 1 ? 'bg-[#22c55e]/10 text-[#22c55e]' : 
                              record.rank === 2 ? 'bg-[#3b82f6]/10 text-[#3b82f6]' : 
                              'bg-[#f59e0b]/10 text-[#f59e0b]'}
                        `}>
                            #{record.rank}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className={`font-medium uppercase ${record.rank <= 3 ? 'text-white' : ''}`}>
                            {text}
                        </span>
                        <span className="text-xs text-gray-500">{record.store}</span>
                    </div>
                </div>
            )
        },
        {
            title: 'VENTES',
            dataIndex: 'sales_count',
            key: 'sales_count',
            width: '20%',
            render: (value, record) => (
                <span className={`font-medium ${record.rank <= 3 ? 'text-white' : ''}`}>
                    {new Intl.NumberFormat('en-US').format(value)}
                </span>
            )
        },
        {
            title: 'PANIER MOYEN',
            dataIndex: 'avg_basket',
            key: 'avg_basket',
            width: '20%',
            render: (value, record) => (
                <span className={`font-medium ${record.rank <= 3 ? 'text-white' : ''}`}>
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        },
        {
            title: 'TOTAL TTC',
            dataIndex: 'total_sales',
            key: 'total_sales',
            width: '25%',
            render: (value, record) => (
                <span className={`font-medium ${record.rank <= 3 ? 'text-white' : ''}`}>
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        }
    ];

    const filteredData = useMemo(() => {
        if (!searchTerm) return salesTeam;
        
        return salesTeam.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.store?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [salesTeam, searchTerm]);

    const exportToExcel = () => {
        const exportData = salesTeam.map(seller => ({
            'Rang': seller.rank,
            'Vendeur': seller.name,
            'Magasin': seller.store,
            'Nombre de ventes': seller.sales_count,
            'Panier moyen': `${seller.avg_basket} DH`,
            'Total TTC': `${seller.total_sales} DH`
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        XLSX.utils.book_append_sheet(wb, ws, "Classement Vendeurs");
        XLSX.writeFile(wb, `classement_vendeurs_${storeId}_${dateRange}.xlsx`);
    };

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
        <div className="flex flex-col h-full p-4 xs:p-5 bg-[#1F2937] shadow-lg rounded-xl">
            <div className="relative mb-4">
                <div 
                    className="absolute inset-0 bg-white/5 backdrop-blur-[2px] transform skew-x-[-20deg] rounded 
                        shadow-[0_8px_32px_rgba(31,41,55,0.5)] 
                        after:absolute after:inset-0 after:bg-gradient-to-r 
                        after:from-white/10 after:to-transparent after:rounded
                        before:absolute before:inset-0 before:bg-blue-500/20 before:blur-[15px] before:rounded"
                />
                <h2 className="relative z-10 px-6 py-2.5 flex items-center gap-2 text-xl font-semibold text-white">
                    <FaUsers className="text-lg text-blue-400" />
                    Classement Vendeurs
                </h2>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#111827] border-0 rounded-lg text-gray-300 placeholder-gray-500 focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                <button 
                    onClick={exportToExcel}
                    className="p-2 bg-[#111827] text-[#60A5FA] hover:text-[#3b82f6] rounded-lg transition-colors shrink-0"
                >
                    <FaFileExport size={20} />
                </button>
            </div>
            <div className="flex-1">
                <BasicTable 
                    dataSource={filteredData}
                    columns={width >= 768 ? getDesktopColumns() : getMobileColumns()}
                    rowKey="name"
                    showSorterTooltip={false}
                    pagination={false}
                    size="small"
                    className="sales-team-table h-full dark"
                    scroll={{ y: 360 }}
                    style={{
                        backgroundColor: '#111827',
                        borderRadius: '8px',
                    }}
                />
            </div>
            <style jsx global>{`
                .sales-team-table .ant-table {
                    background: #111827 !important;
                }
                .sales-team-table .ant-table-thead > tr > th {
                    background: #111827 !important;
                    border-bottom: 1px solid #1F2937 !important;
                }
                .sales-team-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #1F2937 !important;
                }
                .sales-team-table .ant-table-tbody > tr:hover > td {
                    background: #1F2937 !important;
                }
                .sales-team-table .ant-table-tbody > tr.ant-table-row:hover > td {
                    background: #1F2937 !important;
                }
            `}</style>
        </div>
    );
};

export default SalesTeamLeaderboard; 