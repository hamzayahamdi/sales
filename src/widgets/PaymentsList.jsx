import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useWindowSize } from 'react-use';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const STORE_COLORS = {
    'Casablanca': { color: '#22c55e', bg: '#22c55e', shadow: 'rgba(34,197,94,0.3)' },
    'Rabat': { color: '#3b82f6', bg: '#3b82f6', shadow: 'rgba(59,130,246,0.3)' },
    'Marrakech': { color: '#f59e0b', bg: '#f59e0b', shadow: 'rgba(245,158,11,0.3)' },
    'Tanger': { color: '#ec4899', bg: '#ec4899', shadow: 'rgba(236,72,153,0.3)' },
    'Outlet': { color: '#8b5cf6', bg: '#8b5cf6', shadow: 'rgba(139,92,246,0.3)' }
};

const PAYMENT_ICONS = {
    'Carte bancaire': FaCreditCard,
    'Espèce': FaMoneyBillWave,
    'Virement': FaUniversity,
    'Chèque': FaMoneyCheck
};

const getStoreFromInvoiceRef = (invoiceRef) => {
    if (invoiceRef.startsWith('BCC')) return 'Casablanca';
    if (invoiceRef.startsWith('IN')) return 'Rabat';
    if (invoiceRef.startsWith('BCT')) return 'Tanger';
    if (invoiceRef.startsWith('BCM')) return 'Marrakech';
    if (invoiceRef.startsWith('BCO')) return 'Outlet';
    return null;
};

const PaymentsList = ({ dateRange, storeId }) => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedPayments, setDisplayedPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const { width } = useWindowSize();
    const scrollContainerRef = useRef(null);

    const pageSize = width < 640 ? 10 : 10;

    const filteredPayments = useMemo(() => {
        if (!searchTerm) return payments;
        
        const searchLower = searchTerm.toLowerCase();
        
        return payments.filter(payment => {
            const storeName = getStoreFromInvoiceRef(payment.invoice_ref);
            
            return payment.payment_ref?.toLowerCase().includes(searchLower) ||
                   payment.invoice_ref?.toLowerCase().includes(searchLower) ||
                   payment.payment_method?.toLowerCase().includes(searchLower) ||
                   storeName?.toLowerCase().includes(searchLower);
        });
    }, [payments, searchTerm]);

    const fetchPayments = async (page = 1, newSearchTerm = searchTerm) => {
        setIsPageLoading(true);
        try {
            const formData = new FormData();
            const formattedDateRange = Array.isArray(dateRange) 
                ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                : dateRange;

            formData.append('date_range', formattedDateRange);
            formData.append('store_id', storeId);
            formData.append('page', page);
            formData.append('per_page', pageSize);
            formData.append('search_term', newSearchTerm);

            const response = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_sales_new1.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.payments) {
                setPayments(data.payments);
                setDisplayedPayments(data.payments);
                setTotalItems(data.pagination.total_count);
            }
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setPayments([]);
            setDisplayedPayments([]);
            setTotalItems(0);
        } finally {
            setIsPageLoading(false);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            await fetchPayments(1, '');
        };

        if (dateRange && storeId) {
            loadData();
        }
    }, [storeId, dateRange]);

    const handleSearch = useCallback(async (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        await fetchPayments(1, value);
    }, [fetchPayments]);

    const handlePageChange = async (page) => {
        setIsChangingPage(true);
        setCurrentPage(page);
        
        try {
            await fetchPayments(page);
        } finally {
            setTimeout(() => {
                setIsChangingPage(false);
            }, 300);
        }
        
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // Pagination Component
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

    const exportToExcel = () => {
        // Prepare data for export
        const exportData = payments.map(payment => ({
            'Référence': payment.payment_ref,
            'Date': payment.payment_date,
            'Méthode': payment.payment_method,
            'Montant': payment.amount,
            'Facture': payment.invoice_ref
        }));

        // Create workbook and worksheet
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        // Add worksheet to workbook
        XLSX.utils.book_append_sheet(wb, ws, "Paiements");

        // Save file
        XLSX.writeFile(wb, `paiements_${storeId}_${dateRange}.xlsx`);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col h-[1392px] p-4 xs:p-5 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Liste des paiements</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                        <div className="h-10 bg-gray-100 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[1392px] p-4 xs:p-5 bg-white shadow-lg rounded-xl">
            {/* Title */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#599AED]/10">
                        <FaMoneyBillWave className="w-5 h-5 text-[#599AED]" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Liste des paiements</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Historique des paiements</p>
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
                >
                    <FaFileExport size={20} />
                </button>
            </div>

            {/* Add top pagination */}
            {totalItems > 0 && (
                <PaginationComponent
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                />
            )}

            {/* Content with loading overlay */}
            <div className="flex-1 overflow-auto relative" ref={scrollContainerRef}>
                <div className={`grid grid-cols-1 gap-4 px-0 transition-opacity duration-200 ${
                    isChangingPage ? 'opacity-50' : 'opacity-100'
                }`}>
                    {filteredPayments.map((payment, index) => {
                        const PaymentIcon = PAYMENT_ICONS[payment.payment_method] || FaMoneyBillWave;
                        const store = STORE_COLORS[getStoreFromInvoiceRef(payment.invoice_ref)];
                        
                        return (
                            <div key={index} className="bg-[#F3F3F8] hover:bg-[#599AED]/5 transition-colors duration-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-900">{payment.payment_ref}</span>
                                            <PaymentIcon 
                                                className="w-5 h-5 text-[#599AED]"
                                            />
                                            {storeId === 'all' && store && (
                                                <span 
                                                    className="px-2 py-0.5 text-xs font-medium rounded-full text-white"
                                                    style={{
                                                        backgroundColor: store.bg,
                                                        boxShadow: `0 0 10px ${store.shadow}`,
                                                    }}
                                                >
                                                    {getStoreFromInvoiceRef(payment.invoice_ref)}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{payment.payment_date}</span>
                                            <span className="text-xs text-gray-600">{payment.payment_method}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-gray-900">{payment.amount} DH</span>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    Facture: {payment.invoice_ref}
                                </div>
                            </div>
                        );
                    })}
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
                <PaginationComponent
                    current={currentPage}
                    total={totalItems}
                    pageSize={pageSize}
                    onChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default PaymentsList; 