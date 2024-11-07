import { useState, useEffect, useMemo } from 'react';
import BasicTable from '@components/BasicTable';
import { useWindowSize } from 'react-use';
import { FaSearch, FaFileExport, FaTimes } from 'react-icons/fa';
import { TbAlertSquareRoundedFilled } from 'react-icons/tb';
import * as XLSX from 'xlsx';

const CATEGORIES = [
    'Salon en L', 'Salon en U', 'Canapé 2 Places', 'Canapé 3 Places', 'Fauteuil', 
    'Chaise', 'Table de Salle à Manger', 'Table Basse', 'Meubles TV', "Table d'Appoint",
    'Buffet', 'Console', 'Bibliothèque', 'Lit', 'Table de Chevet', "Ensemble d'Extérieur",
    'Transat', 'Table Extérieur', 'Chaise Extérieur', 'Miroirs', 'Pouf', 'Tableaux',
    'Luminaire-Luxalight', 'Couettes', 'Matelas', 'Oreillers', 'Tapis'
];

const SearchInput = ({ searchTerm, setSearchTerm }) => (
    <div className="relative flex-1">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, référence ou catégorie..."
            className="w-full pl-10 pr-4 py-2 bg-[#F3F3F8] border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#599AED]"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        {searchTerm && (
            <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
                <FaTimes className="w-4 h-4" />
            </button>
        )}
    </div>
);

const StockIndex = ({ storeId = 'all' }) => {
    const { width } = useWindowSize();
    const [stockData, setStockData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStockData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(
                `https://ratio.sketchdesign.ma/ratio/fetch_stock_days.php?store_id=${storeId}`
            );
            const data = await response.json();
            
            if (Array.isArray(data)) {
                const uniqueData = Array.from(new Map(data.map(item => [item.ref, item])).values());
                setStockData(uniqueData);
            }
        } catch (error) {
            console.error('Failed to fetch stock data:', error);
            setStockData([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStockData();
    }, [storeId]);

    const filteredData = useMemo(() => {
        let filtered = [...stockData];

        if (searchTerm.trim()) {
            const searchTerms = searchTerm.toLowerCase().trim().split(' ');
            filtered = filtered.filter(item => 
                searchTerms.every(term =>
                    item.ref.toLowerCase().includes(term) ||
                    item.name.toLowerCase().includes(term) ||
                    item.category.toLowerCase().includes(term)
                )
            );
        }

        return filtered.sort((a, b) => {
            if (a.days_in_stock === 999999 && b.days_in_stock !== 999999) return -1;
            if (a.days_in_stock !== 999999 && b.days_in_stock === 999999) return 1;
            
            if (a.days_in_stock === 999999 && b.days_in_stock === 999999) {
                return b.price - a.price;
            }
            
            return b.days_in_stock - a.days_in_stock;
        });
    }, [stockData, searchTerm]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);
    };

    const getStockStatus = (days) => {
        if (days === 999999) return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF1F1] border-l-4 border-[#FF4747] rounded-r-xl">
                <div className="w-2 h-2 bg-[#FF4747] rounded-full"></div>
                <span className="text-xs font-medium text-[#FF4747]">Pas de ventes</span>
            </div>
        );
        
        if (days > 56) return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF7EC] border-l-4 border-[#FF9500] rounded-r-xl">
                <div className="relative flex">
                    <div className="w-2 h-2 bg-[#FF9500] rounded-full"></div>
                    <div className="absolute inline-flex w-2 h-2 bg-[#FFB347] rounded-full opacity-75 animate-ping"></div>
                </div>
                <span className="text-xs font-medium text-[#FF9500]">{days} jours</span>
            </div>
        );

        return (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5FF] border-l-4 border-[#0091FF] rounded-r-xl">
                <div className="relative flex">
                    <div className="w-2 h-2 bg-[#0091FF] rounded-full"></div>
                    <div className="absolute inline-flex w-2 h-2 bg-[#47B0FF] rounded-full opacity-75 animate-ping"></div>
                </div>
                <span className="text-xs font-medium text-[#0091FF]">{days} jours</span>
            </div>
        );
    };

    const getColumns = () => {
        if (width < 768) {
            return [
                {
                    title: 'PRODUIT',
                    dataIndex: 'name',
                    key: 'name',
                    width: '60%',
                    render: (text, record) => (
                        <div className="flex flex-col">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-900 truncate">{text}</span>
                                    <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-600 rounded-lg">
                                        {new Intl.NumberFormat('fr-FR').format(record.price)} DH
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                        REF-{record.ref}
                                    </span>
                                    <span className="text-[10px] font-medium text-[#599AED] bg-[#599AED]/10 px-1.5 py-0.5 rounded">
                                        {record.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                },
                {
                    title: 'JOURS DE STOCK',
                    dataIndex: 'days_in_stock',
                    key: 'days_in_stock',
                    width: '40%',
                    align: 'right',
                    render: (days) => getStockStatus(days)
                }
            ];
        }

        return [
            {
                title: 'PRODUIT',
                dataIndex: 'name',
                key: 'name',
                width: '40%',
                render: (text, record) => (
                    <div className="flex items-start gap-3">
                        <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 truncate">{text}</span>
                                <span className="shrink-0 px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-600 rounded-lg">
                                    {new Intl.NumberFormat('fr-FR').format(record.price)} DH
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-medium text-gray-400">REF-{record.ref}</span>
                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                <span className="text-[10px] font-medium text-[#599AED]">{record.category}</span>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'STOCK & VENTES',
                dataIndex: 'stock',
                key: 'stock',
                width: '25%',
                align: 'center',
                render: (_, record) => (
                    <div className="flex items-center justify-center">
                        <div className="w-[200px] h-[38px] flex items-center bg-[#F3F3F8] rounded-lg p-1">
                            <div className="flex items-center justify-center w-[70px] h-[30px] bg-[#599AED] text-white rounded-md">
                                <span className="text-sm font-semibold">{record.current_stock}</span>
                            </div>
                            <div className="flex items-center justify-center flex-1 h-[30px] ml-1 bg-gray-200 text-gray-700 rounded-md">
                                <span className="text-[11px] font-medium">{record.sales_4_weeks} ventes</span>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                title: 'JOURS DE STOCK',
                dataIndex: 'days_in_stock',
                key: 'days_in_stock',
                width: '20%',
                align: 'right',
                render: (days) => getStockStatus(days)
            }
        ];
    };

    const exportToExcel = () => {
        const exportData = stockData.map(item => ({
            'Référence': item.ref,
            'Produit': item.name,
            'Catégorie': item.category,
            'Stock': item.stock,
            'Ventes 4 semaines': item.sales,
            'Jours de stock': item.days_in_stock === 999999 ? 'Pas de ventes' : item.days_in_stock
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);
        XLSX.utils.book_append_sheet(wb, ws, "Stock Index");
        XLSX.writeFile(wb, `stock_index_${storeId}.xlsx`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Stock Index</h2>
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
            {/* Title section */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-red-500">
                        <TbAlertSquareRoundedFilled className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Produits en Alerte</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Produits à forte valeur avec rotation lente</p>
                    </div>
                </div>
                
                {/* Formula badge */}
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#F3F3F8] rounded-lg">
                    <div className="w-1.5 h-1.5 bg-[#599AED] rounded-full"></div>
                    <span className="text-xs font-medium text-gray-600">
                        Jours de stock = Stock actuel ÷ Ventes (4 semaines)
                    </span>
                </div>
            </div>

            {/* Simplified search and export section */}
            <div className="flex items-center gap-2 mb-4">
                <SearchInput 
                    searchTerm={searchTerm}
                    setSearchTerm={handleSearchChange}
                />
                <button 
                    onClick={exportToExcel}
                    className="p-2 bg-[#F3F3F8] text-[#599AED] hover:bg-[#599AED] hover:text-white rounded-lg transition-colors shrink-0"
                >
                    <FaFileExport size={20} />
                </button>
            </div>

            {/* Results count */}
            <div className="mb-3 text-sm text-gray-500">
                {filteredData.length} résultats trouvés
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden">
                <BasicTable 
                    dataSource={filteredData}
                    columns={getColumns()}
                    rowKey="ref"
                    showSorterTooltip={false}
                    pagination={false}
                    size="middle"
                    className="stock-index-table h-full"
                    scroll={{ y: 360 }}
                />
            </div>

            <style jsx global>{`
                .stock-index-table .ant-table {
                    background: transparent !important;
                }
                .stock-index-table .ant-table-thead > tr > th {
                    background: #F9FAFB !important;
                    border-bottom: 1px solid #E5E7EB !important;
                    color: #4B5563 !important;
                    font-weight: 600;
                    padding: 12px 16px;
                }
                .stock-index-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #F3F4F6 !important;
                    padding: 12px 16px;
                }
                .stock-index-table .ant-table-tbody > tr:hover > td {
                    background: #F9FAFB !important;
                }
            `}</style>
        </div>
    );
};

export default StockIndex; 