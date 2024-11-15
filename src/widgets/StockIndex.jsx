import { useState, useEffect, useMemo, useRef } from 'react';
import BasicTable from '@components/BasicTable';
import { useWindowSize } from 'react-use';
import { FaSearch, FaFileExport, FaTimes, FaChevronLeft, FaChevronRight, FaBox } from 'react-icons/fa';
import { TbAlertSquareRoundedFilled } from 'react-icons/tb';
import * as XLSX from 'xlsx';

const CATEGORIES = [
    'Salon en L', 'Salon en U', 'Canapé 2 Places', 'Canapé 3 Places', 'Fauteuil', 
    'Chaise', 'Table de Salle à Manger', 'Table Basse', 'Meubles TV', "Table d'Appoint",
    'Buffet', 'Console', 'Bibliothèque', 'Lit', 'Table de Chevet', "Ensemble d'Extérieur",
    'Transat', 'Table Extérieur', 'Chaise Extérieur', 'Miroirs', 'Pouf', 'Tableau', 'Tableaux',
    'Luminaire-Luxalight', 'Couettes', 'Matelas', 'Oreillers', 'Tapis'
];

const parseProductDetails = (fullName) => {
    // Remove commas and normalize text
    const normalizedInput = fullName
        .replace(/,/g, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const normalizedCategories = CATEGORIES.map(cat => ({
        original: cat,
        normalized: cat.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
    }));

    let productName = '';
    let category = '';
    let dimensions = '';

    const foundCategory = normalizedCategories.find(cat => 
        normalizedInput.includes(cat.normalized)
    );
    
    if (foundCategory) {
        const parts = normalizedInput.split(foundCategory.normalized);
        productName = parts[0].trim();
        dimensions = parts[1]?.trim() || '';
        category = foundCategory.original;
    } else {
        productName = fullName;
    }

    return {
        productName: productName.toUpperCase(),
        category: category,
        dimensions: dimensions.toUpperCase()
    };
};

const SearchInput = ({ searchTerm, setSearchTerm }) => (
    <div className="relative flex-1">
        <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher par nom, référence ou catégorie..."
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
);

const StockIndex = ({ storeId = 'all' }) => {
    const { width } = useWindowSize();
    const [stockData, setStockData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const scrollContainerRef = useRef(null);
    const pageSize = width < 640 ? 7 : (storeId === 'all' ? 11 : 10);
    const [productImages, setProductImages] = useState({});

    const fetchStockData = async (page = 1, search = '') => {
        setIsPageLoading(true);
        try {
            const response = await fetch(
                `https://ratio.sketchdesign.ma/ratio/fetch_stock_days.php?store_id=${storeId}&page=${page}&per_page=${pageSize}&search=${search}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors' // Explicitly set CORS mode
                }
            );
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.data) {
                setStockData(data.data);
                setTotalItems(data.pagination.total_count);
            }
        } catch (error) {
            console.error('Failed to fetch stock data:', error);
            setStockData([]);
            setTotalItems(0);
        } finally {
            setIsPageLoading(false);
            setIsLoading(false);
        }
    };

    const fetchProductImages = async () => {
        try {
            const response = await fetch('https://docs.google.com/spreadsheets/d/1mWNxfuTYDho--Z5qCzvBErN2w0ZNBelND6rdzPAyC90/gviz/tq');
            
            if (!response.ok) {
                throw new Error('Failed to fetch spreadsheet data');
            }

            const text = await response.text();
            // Extract the JSON part from the response
            const jsonStart = text.indexOf('{');
            const jsonEnd = text.lastIndexOf('}') + 1;
            const jsonString = text.slice(jsonStart, jsonEnd);
            const data = JSON.parse(jsonString);

            // Create mapping of product refs to image URLs
            const imageMapping = {};
            data.table.rows.forEach(row => {
                if (row.c && row.c[3] && row.c[7]) {
                    const ref = row.c[3].v?.toString().trim(); // Product ref (4th column)
                    const imageUrl = row.c[7].v?.toString().trim(); // Image URL (8th column)
                    if (ref && imageUrl) {
                        imageMapping[ref] = imageUrl;
                    }
                }
            });

            setProductImages(imageMapping);
        } catch (error) {
            console.error('Failed to fetch product images:', error);
        }
    };

    useEffect(() => {
        fetchStockData(1, searchTerm);
        fetchProductImages();
    }, [storeId, searchTerm]);

    const handlePageChange = async (page) => {
        setIsChangingPage(true);
        setCurrentPage(page);
        
        try {
            await fetchStockData(page, searchTerm);
        } finally {
            setTimeout(() => {
                setIsChangingPage(false);
            }, 300); // Small delay to ensure smooth transition
        }
        
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

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
                    width: '55%',
                    render: (text, record) => {
                        const details = parseProductDetails(text);
                        const words = details.productName.split(' ');
                        const firstWord = words[0];
                        const remainingWords = words.slice(1).join(' ');
                        
                        return (
                            <div className="flex items-start gap-2">
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-white relative shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                                    {productImages[record.ref] ? (
                                        <img 
                                            src={productImages[record.ref]} 
                                            alt={text}
                                            className="w-full h-full object-contain p-1"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white">
                                            <FaBox className="w-5 h-5 text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0 flex-1">
                                    <div className="flex flex-col gap-0.5">
                                        <div className="flex items-center gap-1">
                                            <span className="text-sm font-semibold text-gray-900 truncate">
                                                {firstWord}
                                                {remainingWords && (
                                                    <span className="text-[11px] bg-gradient-to-r from-gray-50 to-gray-100 px-1 rounded"> {remainingWords}</span>
                                                )}
                                                {details.dimensions && (
                                                    <span className="text-[11px] bg-gradient-to-r from-gray-50 to-gray-100 px-1 rounded ml-1">{details.dimensions}</span>
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[10px] text-gray-400">REF: {record.ref}</span>
                                            {details.category && (
                                                <span className="text-[10px] font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full w-fit border border-gray-200">
                                                    {details.category}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                },
                {
                    title: 'PRIX & STOCK',
                    dataIndex: 'days_in_stock',
                    key: 'days_in_stock',
                    width: '45%',
                    align: 'right',
                    render: (days, record) => (
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="w-[140px] h-[32px] flex items-center bg-[#F3F3F8] rounded-lg p-1">
                                <div className="flex items-center justify-center w-[65px] h-[24px] bg-amber-500 text-white rounded-md">
                                    <span className="text-[11px] font-medium">{new Intl.NumberFormat('fr-FR').format(record.price)} DH</span>
                                </div>
                                <div className="flex items-center justify-center w-[40px] h-[24px] ml-1 bg-[#599AED] text-white rounded-md">
                                    <span className="text-[11px] font-medium">{record.current_stock}</span>
                                </div>
                            </div>
                            {getStockStatus(days)}
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
                width: '40%',
                render: (text, record) => {
                    const details = parseProductDetails(text);
                    
                    // Split product name into words
                    const words = details.productName.split(' ');
                    const firstWord = words[0];
                    const remainingWords = words.slice(1).join(' ');
                    
                    return (
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-xl overflow-hidden bg-white relative shrink-0 shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                                {productImages[record.ref] ? (
                                    <img 
                                        src={productImages[record.ref]} 
                                        alt={text}
                                        className="w-full h-full object-contain p-1"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-white">
                                        <FaBox className="w-8 h-8 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-[15px] text-gray-900">
                                        {firstWord}
                                        {remainingWords && (
                                            <span className="text-[12px] bg-gradient-to-r from-gray-50 to-gray-100 px-1 rounded"> {remainingWords}</span>
                                        )}
                                        {details.dimensions && (
                                            <span className="text-[12px] bg-gradient-to-r from-gray-50 to-gray-100 px-1 rounded ml-1">{details.dimensions}</span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-gray-400">REF: {record.ref}</span>
                                    {details.category && (
                                        <span className="text-[10px] font-medium bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 px-2 py-0.5 rounded-full w-fit border border-gray-200">
                                            {details.category}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }
            },
            {
                title: 'PRIX & STOCK & VENTES',
                dataIndex: 'stock',
                key: 'stock',
                width: '25%',
                align: 'center',
                render: (_, record) => (
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-[200px] h-[34px] flex items-center bg-[#F3F3F8] rounded-lg p-1">
                            <div className="flex items-center justify-center w-[80px] h-[26px] bg-amber-500 text-white rounded-md">
                                <span className="text-xs font-medium">{new Intl.NumberFormat('fr-FR').format(record.price)} DH</span>
                            </div>
                            <div className="flex items-center justify-center flex-1 h-[26px] ml-1">
                                <div className="flex items-center justify-center w-[50px] h-[26px] bg-[#599AED] text-white rounded-md">
                                    <span className="text-xs font-medium">{record.current_stock}</span>
                                </div>
                                <div className="flex items-center justify-center flex-1 h-[26px] ml-1 bg-gray-200 text-gray-700 rounded-md">
                                    <span className="text-[11px] font-medium">{record.sales_4_weeks} ventes</span>
                                </div>
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

    const PaginationComponent = ({ current, total, pageSize, onChange }) => {
        const totalPages = Math.ceil(total / pageSize);
        const startItem = ((current - 1) * pageSize) + 1;
        const endItem = Math.min(current * pageSize, total);

        const getVisiblePages = () => {
            const delta = 2;
            const range = [];
            const rangeWithDots = [];
            let l;

            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= current - delta && i <= current + delta)) {
                    range.push(i);
                }
            }

            range.forEach(i => {
                if (l) {
                    if (i - l === 2) {
                        rangeWithDots.push(l + 1);
                    } else if (i - l !== 1) {
                        rangeWithDots.push('...');
                    }
                }
                rangeWithDots.push(i);
                l = i;
            });

            return rangeWithDots;
        };

        return (
            <div className="flex items-center justify-between py-3 px-1">
                <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-700">{startItem}-{endItem}</span> sur <span className="font-medium text-gray-700">{total}</span>
                </div>

                <div className="flex items-center gap-1.5">
                    <button
                        onClick={() => current > 1 && onChange(current - 1)}
                        disabled={current === 1}
                        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                            current === 1 
                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                                : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                        }`}
                    >
                        <FaChevronLeft className="w-3 h-3" />
                    </button>

                    <div className="flex items-center gap-1">
                        {getVisiblePages().map((pageNumber, index) => (
                            pageNumber === '...' ? (
                                <div 
                                    key={`dots-${index}`}
                                    className="w-8 h-8 flex items-center justify-center text-gray-400"
                                >
                                    ⋯
                                </div>
                            ) : (
                                <button
                                    key={pageNumber}
                                    onClick={() => onChange(pageNumber)}
                                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm transition-all ${
                                        pageNumber === current
                                            ? 'bg-[#599AED] text-white font-medium border border-[#599AED]'
                                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-[#599AED] border border-gray-200'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => current < totalPages && onChange(current + 1)}
                        disabled={current === totalPages}
                        className={`flex items-center justify-center w-8 h-8 rounded-md transition-all ${
                            current === totalPages 
                                ? 'bg-gray-50 text-gray-300 cursor-not-allowed' 
                                : 'bg-white text-gray-500 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                        }`}
                    >
                        <FaChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        );
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

            {/* Add top pagination */}
            {totalItems > 0 && (
                <div className="mb-4">
                    <PaginationComponent
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                </div>
            )}

            {/* Table container with loading overlay */}
            <div className="flex-1 overflow-hidden relative" ref={scrollContainerRef}>
                <div className={`transition-opacity duration-200 ${
                    isChangingPage ? 'opacity-50' : 'opacity-100'
                }`}>
                    <BasicTable 
                        dataSource={stockData}
                        columns={getColumns()}
                        rowKey="ref"
                        showSorterTooltip={false}
                        pagination={false}
                        size="middle"
                        className="stock-index-table h-full"
                        scroll={{ y: width < 768 ? 900 : (storeId === 'all' ? 1000 : 900) }}
                    />
                </div>
                
                {/* Loading overlay */}
                {isChangingPage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-[1px]">
                        <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full border-[3px] border-t-[#599AED] border-r-[#599AED] border-b-[#599AED]/20 border-l-[#599AED]/20 animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-8 h-8 rounded-full border-[2px] border-t-[#599AED]/30 border-r-[#599AED]/30 border-b-[#599AED] border-l-[#599AED] animate-spin"></div>
                                </div>
                            </div>
                            <span className="text-sm font-medium text-gray-500">
                                Chargement...
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom pagination */}
            {totalItems > 0 && (
                <div className="mt-4">
                    <PaginationComponent
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                </div>
            )}

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