// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';
import TopSellingCollapse from '@components/TopSellingCollapse';

// hooks
import {useWindowSize} from 'react-use';
import {useState, useEffect, useMemo, useCallback} from 'react';
import { FaSearch, FaFileExport, FaChartLine, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { TbArrowBadgeUpFilled, TbArrowBadgeDownFilled } from 'react-icons/tb';
import * as XLSX from 'xlsx';

// Add this helper function at the top
const getFrequencyLabel = (frequency) => {
    if (frequency >= 0.8) return 'Très fréquent';
    if (frequency >= 0.5) return 'Fréquent';
    if (frequency >= 0.3) return 'Occasionnel';
    return 'Rare';
};

const TopSelling = ({ storeId = 'all', dateRange }) => {
    const {width} = useWindowSize();
    const [activeCollapse, setActiveCollapse] = useState('');
    const [topProducts, setTopProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productsStock, setProductsStock] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedProducts, setDisplayedProducts] = useState([]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return topProducts;
        
        return topProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.ref.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [topProducts, searchTerm]);

    const fetchAllProducts = async (productName) => {
        try {
            const encodedQuery = encodeURIComponent(productName);
            const response = await fetch(`https://phpstack-937973-4763176.cloudwaysapps.com/data1.php?type=search&query=${encodedQuery}`);
            const data = await response.json();
            
            if (data.error === 'No data found.') {
                return [];
            }
            
            if (data.error) {
                console.error('API Error:', data.error);
                return [];
            }
            
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Failed to fetch products data:', error);
            return [];
        }
    };

    const getStockFieldName = (storeId) => {
        switch(storeId) {
            case '1':
                return 'Stock Casa';
            case '2':
                return 'Stock Rabat';
            case '5':
                return 'Stock Tanger';
            case '6':
                return 'Stock Marrakech';
            case 'all':
                return 'Total Stock';
            default:
                return 'Total Stock';
        }
    };

    const decodeHtmlEntities = (text) => {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value
            .replace(/&#039;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&');
    };

    const fetchTopProducts = async () => {
        setIsLoading(true);
        try {
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

            const salesData = await response.json();
            
            if (salesData.best_selling_products) {
                const productsWithDetails = await Promise.all(
                    salesData.best_selling_products.map(async (product, index) => {
                        const productDetails = await fetchAllProducts(product.label);
                        const matchingProduct = productDetails?.[0];
                        
                        const stockFieldName = getStockFieldName(storeId);
                        
                        return {
                            id: `${product.id || index}`,
                            name: decodeHtmlEntities(product.label),
                            ref: matchingProduct ? matchingProduct['Ref. produit'] : '-',
                            qty_sold: product.qty_sold,
                            total: parseInt(product.total_ttc.replace(/\s/g, '').replace(',', '.')) || 0,
                            stock: matchingProduct ? parseInt(matchingProduct[stockFieldName]) || 0 : 0,
                            num_sales: product.num_sales,
                            avg_qty_per_sale: product.avg_qty_per_sale,
                            days_in_range: product.days_in_range
                        };
                    })
                );

                setTopProducts(productsWithDetails);
                setDisplayedProducts(productsWithDetails);
                
                const newStockData = {};
                productsWithDetails.forEach(product => {
                    if (product.ref !== '-') {
                        newStockData[product.ref] = product.stock;
                    }
                });
                setProductsStock(newStockData);
            }
        } catch (error) {
            console.error('Failed to fetch top products:', error);
            setTopProducts([]);
            setDisplayedProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTopProducts();
    }, [storeId, dateRange]);

    useEffect(() => {
        const handleResize = () => setActiveCollapse('');
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const getStockColumnTitle = (storeId) => {
        switch(storeId) {
            case '1':
                return 'STOCK CASA';
            case '2':
                return 'STOCK RABAT';
            case '5':
                return 'STOCK TANGER';
            case '6':
                return 'STOCK MARRAKECH';
            case 'all':
                return 'STOCK TOTAL';
            default:
                return 'STOCK';
        }
    };

    const getStockStatus = (stock) => {
        if (stock > 2) {
            return (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#E8F5FF] border-l-4 border-[#0091FF] rounded-r-xl">
                    <div className="relative flex">
                        <div className="w-2 h-2 bg-[#0091FF] rounded-full"></div>
                        <div className="absolute inline-flex w-2 h-2 bg-[#47B0FF] rounded-full opacity-75 animate-ping"></div>
                    </div>
                    <span className="text-xs font-medium text-[#0091FF]">Stock: {stock}</span>
                </div>
            );
        } else if (stock === 0) {
            return (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF1F1] border-l-4 border-[#FF4747] rounded-r-xl">
                    <div className="w-2 h-2 bg-[#FF4747] rounded-full"></div>
                    <span className="text-xs font-medium text-[#FF4747]">Rupture</span>
                </div>
            );
        } else {
            return (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFF7EC] border-l-4 border-[#FF9500] rounded-r-xl">
                    <div className="relative flex">
                        <div className="w-2 h-2 bg-[#FF9500] rounded-full"></div>
                        <div className="absolute inline-flex w-2 h-2 bg-[#FFB347] rounded-full opacity-75 animate-ping"></div>
                    </div>
                    <span className="text-xs font-medium text-[#FF9500]">Stock: {stock}</span>
                </div>
            );
        }
    };

    const getPerformanceIndicator = (currentQty, prevQty) => {
        const percentChange = prevQty ? ((currentQty - prevQty) / prevQty) * 100 : 0;
        
        return (
            <div className="flex items-center gap-1">
                {percentChange > 0 ? (
                    <>
                        <TbArrowBadgeUpFilled className="text-emerald-500" />
                        <span className="text-emerald-500 text-sm">
                            {Math.abs(percentChange).toFixed(1)}%
                        </span>
                    </>
                ) : percentChange < 0 ? (
                    <>
                        <TbArrowBadgeDownFilled className="text-red-500" />
                        <span className="text-red-500 text-sm">
                            {Math.abs(percentChange).toFixed(1)}%
                        </span>
                    </>
                ) : (
                    <span className="text-gray-400 text-sm">-</span>
                )}
            </div>
        );
    };

    const getTurnoverRate = (turnover) => {
        const getColorClass = (rate) => {
            if (rate >= 70) return 'text-emerald-500';
            if (rate >= 40) return 'text-amber-500';
            return 'text-red-500';
        };

        return (
            <div className="flex flex-col items-center">
                <span className={`font-medium ${getColorClass(turnover)}`}>
                    {turnover}%
                </span>
                <span className="text-xs text-gray-400">Turnover</span>
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
                        <div className="flex flex-col py-2">
                            <span className="font-medium text-gray-900">{text}</span>
                            <span className="mt-1 text-xs font-medium text-gray-400">REF-{record.ref}</span>
                        </div>
                    )
                },
                {
                    title: 'VENTES',
                    dataIndex: 'performance',
                    key: 'performance',
                    width: '40%',
                    align: 'right',
                    render: (_, record) => (
                        <div className="flex flex-col items-end gap-2">
                            <div className="text-right">
                                <div className="text-lg font-semibold text-gray-900">
                                    {record.qty_sold || 0}
                                    <span className="ml-1 text-sm text-gray-400">pcs</span>
                                </div>
                                <div className="text-sm font-medium text-gray-500">
                                    {new Intl.NumberFormat('fr-FR').format(record.total)} DH
                                </div>
                            </div>
                        </div>
                    )
                }
            ];
        }

        return [
            {
                title: 'PRODUIT',
                dataIndex: 'name',
                key: 'name',
                width: '50%',
                render: (text, record) => (
                    <div className="flex flex-col py-2">
                        <span className="font-medium text-gray-900">{text}</span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 text-xs font-medium text-gray-500 bg-gray-100 rounded-md">
                                REF-{record.ref}
                            </span>
                        </div>
                    </div>
                )
            },
            {
                title: `VENTES & STOCK ${storeId === '1' ? 'CASA' : 
                                       storeId === '2' ? 'RABAT' : 
                                       storeId === '5' ? 'TANGER' : 
                                       storeId === '6' ? 'MARRAKECH' : 'TOTAL'}`,
                dataIndex: 'sales',
                key: 'sales',
                width: '25%',
                align: 'center',
                render: (_, record) => {
                    const stockData = record.stock !== undefined ? record.stock : 0;
                    
                    return (
                        <div className="flex items-center justify-center">
                            <div className="w-[200px] h-[38px] flex items-center bg-[#F3F3F8] rounded-lg p-1">
                                <div className="flex items-center justify-center w-[70px] h-[30px] bg-[#599AED] text-white rounded-md">
                                    <span className="text-sm font-semibold">{record.qty_sold || 0}</span>
                                </div>
                                
                                {stockData > 2 ? (
                                    <div className="flex items-center justify-center flex-1 h-[30px] ml-1 bg-emerald-500 text-white rounded-md">
                                        <div className="flex items-center gap-1">
                                            <span className="relative flex h-1 w-1">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1 w-1 bg-white"></span>
                                            </span>
                                            <span className="text-[11px] font-medium whitespace-nowrap">{stockData} en stock</span>
                                        </div>
                                    </div>
                                ) : stockData === 0 ? (
                                    <div className="flex items-center justify-center flex-1 h-[30px] ml-1 bg-[#EF4444] text-white rounded-md">
                                        <div className="flex items-center gap-1">
                                            <span className="h-1 w-1 rounded-full bg-white"></span>
                                            <span className="text-[11px] font-medium whitespace-nowrap">En rupture</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center flex-1 h-[30px] ml-1 bg-amber-500 text-white rounded-md">
                                        <div className="flex items-center gap-1">
                                            <span className="relative flex h-1 w-1">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-1 w-1 bg-white"></span>
                                            </span>
                                            <span className="text-[11px] font-medium whitespace-nowrap">Stock faible ({stockData})</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }
            },
            {
                title: 'REVENUS',
                dataIndex: 'revenue',
                key: 'revenue',
                width: '25%',
                align: 'right',
                render: (_, record) => {
                    const pricePerPiece = Math.round(record.total / record.qty_sold);
                    return (
                        <div className="flex items-center justify-end">
                            <div className="flex flex-col items-end">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-lg font-bold text-gray-900">
                                        {new Intl.NumberFormat('fr-FR').format(record.total)}
                                    </span>
                                    <span className="text-sm font-medium text-gray-400">DH</span>
                                </div>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-xs text-gray-400">Prix unitaire:</span>
                                    <span className="text-sm font-medium text-[#599AED]">
                                        {new Intl.NumberFormat('fr-FR').format(pricePerPiece)} DH
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                }
            }
        ];
    };

    const exportToExcel = () => {
        const exportData = topProducts.map(product => ({
            'Référence': product.ref,
            'Produit': product.name,
            'Quantité Vendue': product.qty_sold,
            'Stock': product.stock,
            'Total TTC': `${product.total} DH`
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        XLSX.utils.book_append_sheet(wb, ws, "Best Sellers");
        XLSX.writeFile(wb, `bestsellers_${storeId}_${dateRange}.xlsx`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Bestsellers</h2>
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
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50">
                        <FaChartLine className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Bestsellers</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Top produits par ventes</p>
                    </div>
                </div>
            </div>

            {/* Search and Export */}
            <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[#F3F3F8] border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#599AED]"
                    />
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
                <button 
                    onClick={exportToExcel}
                    className="p-2 bg-[#F3F3F8] text-[#599AED] hover:bg-[#599AED] hover:text-white rounded-lg transition-colors shrink-0"
                    title="Exporter en Excel"
                >
                    <FaFileExport size={20} />
                </button>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-hidden">
                <BasicTable 
                    dataSource={filteredProducts}
                    columns={getColumns()}
                    rowKey="id"
                    showSorterTooltip={false}
                    pagination={false}
                    size="middle"
                    className="bestsellers-table h-full"
                    scroll={{ y: 360 }}
                />
            </div>

            <style jsx global>{`
                .bestsellers-table .ant-table {
                    background: transparent !important;
                }
                .bestsellers-table .ant-table-body {
                    height: ${storeId !== 'all' ? '100% !important' : 'auto'};
                    max-height: ${storeId !== 'all' ? '1066px !important' : '360px'};
                }
                .bestsellers-table .ant-table-thead > tr > th {
                    background: #F9FAFB !important;
                    border-bottom: 1px solid #E5E7EB !important;
                    color: #4B5563 !important;
                    font-weight: 600;
                    padding: 12px 16px;
                    position: sticky;
                    top: 0;
                    z-index: 1;
                }
                .bestsellers-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #F3F4F6 !important;
                    padding: 12px 16px;
                }
                .bestsellers-table .ant-table-tbody > tr:hover > td {
                    background: #F9FAFB !important;
                }
                .bestsellers-table .ant-table-tbody > tr.ant-table-row:hover > td {
                    background: #F9FAFB !important;
                }
            `}</style>
        </div>
    );
};

export default TopSelling;