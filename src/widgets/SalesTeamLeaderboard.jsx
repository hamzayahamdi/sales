// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';

// hooks
import { useState, useEffect, useMemo } from 'react';
import { useWindowSize } from 'react-use';
import dayjs from 'dayjs';
import { FaSearch, FaFileExport, FaUsers, FaCrown, FaTimes } from 'react-icons/fa';
import * as XLSX from 'xlsx';

// Add this helper function to get store color
const getStoreColor = (storeName) => {
    // First normalize the store name
    const normalizedName = storeName?.trim().toLowerCase();
    
    if (normalizedName?.includes('sketch casa')) {
        return 'bg-gradient-to-r from-[#599AED] to-[#3B82F6] text-white';
    }
    if (normalizedName?.includes('rabat/outlet')) {
        return 'bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white';
    }
    if (normalizedName?.includes('sketch tanger')) {
        return 'bg-gradient-to-r from-[#F59E0B] to-[#D97706] text-white';
    }
    if (normalizedName?.includes('sketch marrakech')) {
        return 'bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white';
    }
    if (normalizedName?.includes('tous les magasins')) {
        return 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5] text-white';
    }
    
    return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white';
};

// Add this function to format store names
const formatStoreName = (storeName) => {
    if (!storeName) return '';
    
    const name = storeName.toLowerCase().trim();
    
    if (name.includes('sketch casa')) return 'Casablanca';
    if (name.includes('sketch tanger')) return 'Tanger';
    if (name.includes('sketch marrakech')) return 'Marrakech';
    if (name.includes('rabat/outlet')) return 'Rabat/Outlet';
    if (name.includes('tous les magasins')) return 'Tous les magasins';
    
    return storeName;
};

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

            const response = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_sales_new.php', {
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
            render: (text, record) => {
                const names = text.trim().split(' ');
                const firstName = names[0] || '';
                const lastName = names[names.length - 1] || '';
                const initials = firstName[0] && lastName[0] ? `${firstName[0]}${lastName[0]}` : '';
                
                return (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className={`absolute -top-1.5 -right-1.5 z-10 w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold shadow-lg
                                ${record.rank === 1 
                                    ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white' 
                                    : record.rank === 2 
                                        ? 'bg-gradient-to-br from-[#599AED] to-[#3B82F6] text-white'
                                        : record.rank === 3 
                                            ? 'bg-gradient-to-br from-[#CD7F32] to-[#B87333] text-white'
                                            : 'bg-gray-200 text-gray-600'}`}
                            >
                                {record.rank === 1 
                                    ? <FaCrown className="w-3 h-3" />
                                    : `#${record.rank}`
                                }
                            </div>
                            <div className={`w-11 h-11 flex items-center justify-center rounded-xl font-bold text-sm shadow-sm
                                ${record.rank === 1 
                                    ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white' 
                                    : record.rank === 2 
                                        ? 'bg-gradient-to-br from-[#599AED]/10 to-[#3B82F6]/5 text-[#599AED]'
                                        : record.rank === 3 
                                            ? 'bg-gradient-to-br from-[#CD7F32]/10 to-[#B87333]/5 text-[#CD7F32]'
                                            : 'bg-[#F3F3F8] text-gray-600'}`}
                            >
                                {initials}
                            </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate text-gray-900 uppercase">
                                {text}
                            </span>
                            <span className={`text-xs px-2.5 py-1 rounded-full inline-flex items-center justify-center w-fit shadow-sm ${getStoreColor(record.store)}`}>
                                {formatStoreName(record.store)}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'PERFORMANCE',
            dataIndex: 'total_sales',
            key: 'total_sales',
            width: '40%',
            align: 'right',
            render: (value, record) => (
                <div className="flex flex-col items-end gap-1">
                    <span className="font-semibold text-gray-900">
                        {new Intl.NumberFormat('fr-FR').format(value)} DH
                    </span>
                    <span className="text-xs text-gray-500">
                        {record.sales_count} ventes
                    </span>
                </div>
            )
        }
    ];

    const getDesktopColumns = () => [
        {
            title: 'VENDEUR',
            dataIndex: 'name',
            key: 'name',
            width: '45%',
            render: (text, record) => {
                const names = text.trim().split(' ');
                const firstName = names[0] || '';
                const lastName = names[names.length - 1] || '';
                const initials = firstName[0] && lastName[0] ? `${firstName[0]}${lastName[0]}` : '';
                
                return (
                    <div className="flex items-center gap-4">
                        <div className="relative flex items-center justify-center">
                            <div className={`absolute -top-2 -right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full shadow-lg
                                ${record.rank === 1 
                                    ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500] text-white'
                                    : record.rank === 2 
                                        ? 'bg-gradient-to-br from-[#599AED] to-[#3B82F6] text-white'
                                        : record.rank === 3 
                                            ? 'bg-gradient-to-br from-[#CD7F32] to-[#B87333] text-white'
                                            : 'bg-gray-200 text-gray-600'}`}
                            >
                                {record.rank === 1 
                                    ? <FaCrown className="w-3.5 h-3.5" />
                                    : <span className="text-[11px] font-bold">#{record.rank}</span>
                                }
                            </div>
                            <div className={`w-12 h-12 flex items-center justify-center rounded-xl shadow-sm
                                ${record.rank === 1 
                                    ? 'bg-gradient-to-br from-amber-500 to-yellow-500 text-white'
                                    : record.rank === 2 
                                        ? 'bg-gradient-to-br from-[#599AED]/10 to-[#3B82F6]/5 text-[#599AED]'
                                        : record.rank === 3 
                                            ? 'bg-gradient-to-br from-[#CD7F32]/10 to-[#B87333]/5 text-[#CD7F32]'
                                            : 'bg-[#F3F3F8] text-gray-600'}`}
                            >
                                <span className="text-base font-bold">{initials}</span>
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-gray-900 truncate uppercase">
                                {text}
                            </span>
                            <span className={`text-[11px] px-2 py-0.5 rounded-full inline-flex items-center justify-center w-fit shadow-sm ${getStoreColor(record.store)}`}>
                                {formatStoreName(record.store)}
                            </span>
                        </div>
                    </div>
                );
            }
        },
        {
            title: 'VENTES',
            dataIndex: 'sales_count',
            key: 'sales_count',
            width: '18%',
            align: 'center',
            render: (value, record) => (
                <div className="flex items-center justify-center">
                    <div className="w-[140px] h-[38px] flex items-center bg-[#F3F3F8] rounded-lg p-1">
                        <div className="flex items-center justify-center w-full h-[30px] bg-[#599AED] text-white rounded-md">
                            <div className="flex items-center gap-2">
                                <span className="text-base font-semibold">{value}</span>
                                <div className="h-3.5 w-[1px] bg-white/30"></div>
                                <span className="text-xs font-medium text-white/90">ventes</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            title: 'PANIER MOYEN',
            dataIndex: 'avg_basket',
            key: 'avg_basket',
            width: '18%',
            align: 'center',
            render: (value) => (
                <div className="px-4 py-2.5 bg-gradient-to-br from-emerald-400/10 via-emerald-400/5 to-emerald-400/0 rounded-xl">
                    <div className="text-base font-bold text-emerald-600">
                        {new Intl.NumberFormat('fr-FR').format(value)} DH
                    </div>
                    <div className="text-xs font-medium text-emerald-500">par vente</div>
                </div>
            )
        },
        {
            title: 'TOTAL TTC',
            dataIndex: 'total_sales',
            key: 'total_sales',
            width: '19%',
            align: 'right',
            render: (value, record) => (
                <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-gray-900">
                            {new Intl.NumberFormat('fr-FR').format(value)}
                        </span>
                        <span className="text-sm font-medium text-gray-400">DH</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-400"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                        </div>
                        <span className="text-xs font-medium text-gray-500">total des ventes</span>
                    </div>
                </div>
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
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Classement Vendeurs</h2>
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
        <div className="flex flex-col h-full p-4 xs:p-5 bg-white shadow-lg rounded-xl">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#599AED]/10">
                        <FaUsers className="w-5 h-5 text-[#599AED]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Classement Vendeurs</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Performance de l'équipe de vente</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 bg-[#F3F3F8] border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#599AED]"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <FaTimes className="w-4 h-4" />
                        </button>
                    )}
                </div>
                <button 
                    onClick={exportToExcel}
                    className="p-2 bg-[#F3F3F8] text-[#599AED] hover:bg-[#599AED] hover:text-white rounded-lg transition-colors shrink-0"
                >
                    <FaFileExport size={20} />
                </button>
            </div>
            <div className="flex-1">
                <BasicTable 
                    dataSource={filteredData}
                    columns={width >= 768 ? getDesktopColumns() : getMobileColumns()}
                    rowKey={(record) => record.rank.toString()}
                    showSorterTooltip={false}
                    pagination={false}
                    size="middle"
                    className="sales-team-table h-full"
                    scroll={{ y: storeId === 'all' ? 350 : 1020 }}
                />
            </div>
            <style jsx global>{`
                .sales-team-table .ant-table {
                    background: transparent !important;
                }
                .sales-team-table .ant-table-thead > tr > th {
                    background: #F3F3F8 !important;
                    border-bottom: 1px solid #E5E7EB !important;
                    color: #4B5563 !important;
                    font-weight: 600;
                    padding: 12px 16px;
                }
                .sales-team-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #F3F4F6 !important;
                    padding: 12px 16px;
                    background: transparent !important;
                }
                .sales-team-table .ant-table-tbody > tr:hover > td {
                    background: #F9FAFB !important;
                }
                
                /* Special styling for #1 row */
                .sales-team-table .ant-table-tbody > tr[data-row-key="1"] {
                    background: linear-gradient(to right, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05)) !important;
                    position: relative;
                    margin: 8px 0;
                }
                
                .sales-team-table .ant-table-tbody > tr[data-row-key="1"] td {
                    background: linear-gradient(to right, #FFF7E6, #FFF9EC) !important;
                    border-bottom: none !important;
                }
                
                .sales-team-table .ant-table-tbody > tr[data-row-key="1"] td:first-child {
                    border-left: 4px solid #FFD700;
                }

                /* Hover effect for #1 */
                .sales-team-table .ant-table-tbody > tr[data-row-key="1"]:hover td {
                    background: linear-gradient(to right, #FFF4D9, #FFF7E6) !important;
                }

                /* Regular styling for other top performers */
                .sales-team-table .ant-table-tbody > tr[data-row-key="2"],
                .sales-team-table .ant-table-tbody > tr[data-row-key="3"] {
                    background: #F8FAFC !important;
                }
            `}</style>
        </div>
    );
};

export default SalesTeamLeaderboard; 