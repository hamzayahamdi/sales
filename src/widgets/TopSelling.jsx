// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';
import TopSellingCollapse from '@components/TopSellingCollapse';

// hooks
import {useWindowSize} from 'react-use';
import {useState, useEffect, useMemo} from 'react';
import { FaSearch, FaFileExport, FaChartLine } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import useTableScroll from '@hooks/useTableScroll';

const TopSelling = ({ storeId = 'all', dateRange }) => {
    const {width} = useWindowSize();
    const [activeCollapse, setActiveCollapse] = useState('');
    const [topProducts, setTopProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productsStock, setProductsStock] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const { ref: tableRef, isScrollable } = useTableScroll();

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

            const response = await fetch('https://sales.sketchdesign.ma/fetch_sales_new.php', {
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
                            stock: matchingProduct ? parseInt(matchingProduct[stockFieldName]) || 0 : 0
                        };
                    })
                );

                setTopProducts(productsWithDetails);
                
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
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm px-4 py-1 rounded-full border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10">
                        In Stock
                    </span>
                    <span className="text-gray-300 text-sm">
                        ({stock} pcs)
                    </span>
                </div>
            );
        } else if (stock === 0) {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm px-4 py-1 rounded-full border border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10">
                        Out of Stock
                    </span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm px-4 py-1 rounded-full border border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10">
                        Low Stock
                    </span>
                    <span className="text-gray-300 text-sm">
                        ({stock} pcs)
                    </span>
                </div>
            );
        }
    };

    const getColumns = () => {
        // Mobile columns (simplified)
        if (width < 768) {
            return [
                {
                    title: 'PRODUIT',
                    dataIndex: 'name',
                    key: 'name',
                    width: '50%',
                    render: (text, record) => (
                        <div className="flex flex-col py-1">
                            <span className="font-medium break-words">{text}</span>
                            <span className="text-xs text-gray-500">Réf: {record.ref}</span>
                        </div>
                    )
                },
                {
                    title: 'QTÉ',
                    dataIndex: 'qty_sold',
                    key: 'qty_sold',
                    width: '20%',
                    render: (value) => (
                        <span className="font-medium">{value}</span>
                    )
                },
                {
                    title: 'TOTAL',
                    dataIndex: 'total',
                    key: 'total',
                    width: '30%',
                    render: (value) => (
                        <span className="font-medium">
                            {new Intl.NumberFormat('en-US').format(value)} DH
                        </span>
                    )
                }
            ];
        }

        // Desktop columns (full view)
        const baseColumns = [
            {
                title: 'PRODUIT',
                dataIndex: 'name',
                key: 'name',
                width: '35%',
                render: (text, record) => (
                    <div className="flex flex-col py-1">
                        <span className="font-medium break-words">{text}</span>
                        <span className="text-xs text-gray-500">Réf: {record.ref}</span>
                    </div>
                )
            },
            {
                title: 'QTÉ VENDU',
                dataIndex: 'qty_sold',
                key: 'qty_sold',
                width: '15%',
                render: (value) => (
                    <span className="font-medium">{value} pcs</span>
                )
            }
        ];

        if (storeId !== '10' && storeId !== 10) {
            baseColumns.push({
                title: getStockColumnTitle(storeId),
                dataIndex: 'stock',
                key: 'stock',
                width: '30%',
                render: (_, record) => getStockStatus(record.stock)
            });
        }

        baseColumns.push({
            title: 'TOTAL TTC',
            dataIndex: 'total',
            key: 'total',
            width: '20%',
            render: (value) => (
                <span className="font-medium">
                    {new Intl.NumberFormat('en-US').format(value)} DH
                </span>
            )
        });

        return baseColumns;
    };

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return topProducts;
        
        return topProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.ref.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [topProducts, searchTerm]);

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
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Bestsellers</h2>
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
                    <FaChartLine className="text-lg text-blue-400" />
                    Bestsellers
                </h2>
            </div>

            {/* Search and Export */}
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

            {/* Table */}
            <div 
                ref={tableRef}
                className={`flex-1 ${isScrollable ? 'touch-auto' : 'touch-none'}`}
            >
                <BasicTable 
                    dataSource={filteredProducts}
                    columns={getColumns()}
                    rowKey="id"
                    showSorterTooltip={false}
                    pagination={false}
                    size="small"
                    className={`top-selling-table h-full dark ${isScrollable ? 'touch-auto' : 'touch-none'}`}
                    scroll={{ y: 360 }}
                    style={{
                        backgroundColor: '#111827',
                        borderRadius: '8px',
                    }}
                />
            </div>
            <style jsx global>{`
                .top-selling-table .ant-table {
                    background: #111827 !important;
                }
                .top-selling-table .ant-table-thead > tr > th {
                    background: #111827 !important;
                    border-bottom: 1px solid #1F2937 !important;
                }
                .top-selling-table .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #1F2937 !important;
                }
                .top-selling-table .ant-table-tbody > tr:hover > td {
                    background: #1F2937 !important;
                }
                .top-selling-table .ant-table-tbody > tr.ant-table-row:hover > td {
                    background: #1F2937 !important;
                }
            `}</style>
        </div>
    );
};

export default TopSelling;