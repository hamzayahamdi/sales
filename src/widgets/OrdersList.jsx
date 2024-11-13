import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useWindowSize } from 'react-use';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport, FaFileInvoice, FaPhone, FaUser, FaUserTie, FaCalendarAlt, FaBox, FaClipboardList, FaInfoCircle, FaExchangeAlt, FaExclamationCircle, FaCheckCircle, FaChevronLeft, FaChevronRight, FaTimes, FaChevronUp } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { RiCheckboxCircleLine, RiErrorWarningLine, RiExchangeLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-hot-toast';

const PAYMENT_ICONS = {
    'Carte bancaire': { icon: FaCreditCard, color: '#22c55e' },
    'Espèce': { icon: FaMoneyBillWave, color: '#3b82f6' },
    'Virement': { icon: FaUniversity, color: '#f59e0b' },
    'Chèque': { icon: FaMoneyCheck, color: '#8b5cf6' }
};

const decodeHtmlEntities = (text) => {
    if (!text) return '';
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value
        .replace(/&#039;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&nbsp;/g, ' ');
};

const OrdersList = ({ dateRange, storeId }) => {
    const { width } = useWindowSize();
    const pageSize = width < 640 ? 8 : 10;
    
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedInvoice, setExpandedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const scrollContainerRef = useRef(null);
    const [expandedInvoices, setExpandedInvoices] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [counters, setCounters] = useState({
        total: 0,
        paye: 0,
        impaye: 0,
        avoir: 0
    });
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [error, setError] = useState(null);
    const searchInputRef = useRef(null);
    const [isChangingPage, setIsChangingPage] = useState(false);
    const [totalCounts, setTotalCounts] = useState({
        total: 0,
        paye: 0,
        impaye: 0,
        avoir: 0
    });

    // Keyboard shortcuts
    useHotkeys('ctrl+f', (e) => {
        e.preventDefault();
        searchInputRef.current?.focus();
    });

    useHotkeys('esc', () => {
        if (searchTerm) handleSearch('');
    });

    // Scroll to top button visibility
    useEffect(() => {
        const handleScroll = () => {
            if (scrollContainerRef.current) {
                setShowScrollTop(scrollContainerRef.current.scrollTop > 500);
            }
        };

        scrollContainerRef.current?.addEventListener('scroll', handleScroll);
        return () => scrollContainerRef.current?.removeEventListener('scroll', handleScroll);
    }, []);

    // Copy to clipboard function
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success('Copié !', {
                duration: 2000,
                position: 'bottom-right',
                style: {
                    background: '#599AED',
                    color: 'white',
                }
            });
        } catch (err) {
            toast.error('Erreur de copie', {
                duration: 2000,
                position: 'bottom-right'
            });
        }
    };

    // Scroll to top function
    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    // Error retry function
    const handleRetry = () => {
        setError(null);
        fetchOrders(currentPage);
    };

    const fetchOrders = async (page = 1, newSearchTerm = searchTerm, status = statusFilter) => {
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
            formData.append('status_filter', status);

            console.log('Fetching orders with params:', {
                date_range: formattedDateRange,
                store_id: storeId,
                page,
                per_page: pageSize,
                search_term: newSearchTerm,
                status_filter: status
            });

            const response = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_orders.php', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.error) {
                console.error('API Error:', data.error);
                throw new Error(data.message || 'Failed to fetch orders');
            }
            
            console.log('API Response:', data);
            
            if (data.orders) {
                setOrders(data.orders);
                setDisplayedOrders(data.orders);
                setTotalItems(data.total_count);
                
                if (status === 'all' && !newSearchTerm) {
                    setTotalCounts(data.counters);
                    setCounters(data.counters);
                } else {
                    setCounters({
                        ...totalCounts,
                        [status]: data.total_count
                    });
                }
            } else {
                setOrders([]);
                setDisplayedOrders([]);
                setTotalItems(0);
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
            setDisplayedOrders([]);
            setTotalItems(0);
            setCounters(totalCounts);
            setError(error.message);
        } finally {
            setIsPageLoading(false);
            setIsLoading(false);
            setIsChangingPage(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setIsPageLoading(true);
            setError(null);
            
            try {
                await fetchOrders(1, '', 'all');
            } catch (error) {
                console.error('Initial load failed:', error);
            }
        };

        if (dateRange && storeId) {
            loadData();
        }
    }, [storeId, dateRange]);

    const handleExpand = (invoiceRef) => {
        setExpandedInvoice(expandedInvoice === invoiceRef ? null : invoiceRef);
    };

    const getPaymentStatus = (order) => {
        if (parseFloat(order.total_invoice_amount) < 0) {
            return null;
        }

        const unpaidAmount = parseFloat(order.amount_unpaid);
        if (unpaidAmount > 0) {
            return (
                <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                    bg-[#FF4444] text-white"
                >
                    Non payé
                </span>
            );
        }

        return (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                bg-[#22DD66] text-white"
            >
                Payé
            </span>
        );
    };

    const exportToExcel = () => {
        const exportData = orders.map(order => ({
            'Référence': order.invoice_ref,
            'Date': order.invoice_date,
            'Client': order.client_name,
            'Téléphone': order.client_phone,
            'ICE': order.client_ice || 'N/A',
            'Commercial': order.commercial_name,
            'Total TTC': order.total_invoice_amount,
            'Reliquat': order.amount_unpaid,
            'Status': parseFloat(order.amount_unpaid) > 0 ? 'Non payé' : 'Payé'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(exportData);

        XLSX.utils.book_append_sheet(wb, ws, "Factures");
        XLSX.writeFile(wb, `factures_${storeId}_${dateRange}.xlsx`);
    };

    // Add these CSS keyframes at the top of your file
    const pulseAnimation = `@keyframes softPulse {
        0% { opacity: 0.9; }
        50% { opacity: 1; }
        100% { opacity: 0.9; }
    }`;

    // Add this style tag to your component
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = pulseAnimation;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Add this animation keyframe at the top of your component
    const pulseRingAnimation = `
        @keyframes pulseRing {
            0% { transform: scale(0.95); opacity: 0.5; }
            50% { transform: scale(1.05); opacity: 0.8; }
            100% { transform: scale(0.95); opacity: 0.5; }
        }
    `;

    // Add the style in useEffect
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = pulseRingAnimation;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [statusFilter, searchTerm]);

    const toggleInvoice = (invoiceRef) => {
        setExpandedInvoices(prev => {
            const newSet = new Set(prev);
            if (newSet.has(invoiceRef)) {
                newSet.delete(invoiceRef);
            } else {
                newSet.add(invoiceRef);
            }
            return newSet;
        });
    };

    const handlePageChange = async (page) => {
        setIsChangingPage(true);
        setCurrentPage(page);
        
        try {
            await fetchOrders(page);
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

    const handleSearch = useCallback(async (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
        await fetchOrders(1, value);
    }, [fetchOrders]);

    const handleStatusFilter = async (status) => {
        setStatusFilter(status);
        setCurrentPage(1);
        await fetchOrders(1, searchTerm, status);
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
                                    ...
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
            <div className="flex flex-col min-h-fit p-5 xs:p-6 bg-white shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Liste des factures</h2>
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
        <>
            <div className="flex flex-col h-full p-4 xs:p-5 bg-white shadow-lg rounded-xl overflow-hidden">
                {/* Title */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#599AED]/10">
                            <FaFileInvoice className="w-5 h-5 text-[#599AED]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Liste des factures</h2>
                            <p className="text-sm text-gray-500 mt-0.5">Historique des factures</p>
                        </div>
                    </div>
                </div>

                {/* Search and Export */}
                <div className="flex items-center gap-2 mb-2">
                    <div className="relative flex-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Rechercher par référence, client, commercial..."
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 bg-[#F3F3F8] border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-[#599AED]"
                        />
                        <FaSearch className={`absolute left-3 top-1/2 -translate-y-1/2 ${
                            isPageLoading ? 'text-[#599AED] animate-pulse' : 'text-gray-400'
                        }`} />
                        <AnimatePresence>
                            {searchTerm && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    onClick={() => handleSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <FaTimes className="w-4 h-4" />
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                    <button 
                        onClick={exportToExcel}
                        className="p-2 bg-[#F3F3F8] text-[#599AED] hover:bg-[#599AED] hover:text-white rounded-lg transition-colors shrink-0"
                    >
                        <FaFileExport size={20} />
                    </button>
                </div>

                {/* Info Text */}
                <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
                        <FaInfoCircle className="w-3 h-3 text-[#599AED]" />
                        <span>Cliquez sur une facture pour voir plus de détails</span>
                    </div>
                </div>

                {/* Status Filter Buttons */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <button
                        onClick={() => handleStatusFilter('all')}
                        style={{
                            backgroundColor: statusFilter === 'all' ? '#599AED' : '#F3F3F8',
                            color: statusFilter === 'all' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'all' ? '0 4px 6px -1px rgba(89, 154, 237, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Tous</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{totalCounts.total}</span>
                    </button>
                    <button
                        onClick={() => handleStatusFilter('paye')}
                        style={{
                            backgroundColor: statusFilter === 'paye' ? '#22DD66' : '#F3F3F8',
                            color: statusFilter === 'paye' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'paye' ? '0 4px 6px -1px rgba(34, 221, 102, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Payé</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{totalCounts.paye}</span>
                    </button>
                    <button
                        onClick={() => handleStatusFilter('impaye')}
                        style={{
                            backgroundColor: statusFilter === 'impaye' ? '#FF4444' : '#F3F3F8',
                            color: statusFilter === 'impaye' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'impaye' ? '0 4px 6px -1px rgba(255, 68, 68, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Impayé</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{totalCounts.impaye}</span>
                    </button>
                    <button
                        onClick={() => handleStatusFilter('avoir')}
                        style={{
                            backgroundColor: statusFilter === 'avoir' ? '#FFB800' : '#F3F3F8',
                            color: statusFilter === 'avoir' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'avoir' ? '0 4px 6px -1px rgba(255, 184, 0, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Avoir</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{totalCounts.avoir}</span>
                    </button>
                </div>

                {/* Top Pagination */}
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
                        {(displayedOrders || []).map((order) => {
                            const isAvoir = parseFloat(order.total_invoice_amount) < 0;
                            const isUnpaid = parseFloat(order.amount_unpaid) > 0;
                            const isExpanded = expandedInvoices.has(order.invoice_ref);
                            
                            // Initialize items array if it's undefined
                            const items = order.items || [];
                            
                            return (
                                <div 
                                    key={order.invoice_ref}
                                    className={`relative overflow-hidden rounded-lg mx-0
                                        transition-all duration-300
                                        ${isExpanded ? 'mb-4' : 'mb-2'}
                                        border-l-4 border-r-4 border-b-4`}
                                    style={{
                                        transform: 'translate3d(0, 0, 0)',
                                        backfaceVisibility: 'hidden',
                                        cursor: 'pointer',
                                        borderLeftColor: isAvoir 
                                            ? '#FFB800'
                                            : isUnpaid 
                                                ? '#FF4444'
                                                : '#599AED',
                                        borderRightColor: isAvoir 
                                            ? '#FF9900'
                                            : isUnpaid 
                                                ? '#FF2222'
                                                : '#4477DD',
                                        borderBottomColor: isAvoir 
                                            ? '#FF9900'
                                            : isUnpaid 
                                                ? '#FF2222'
                                                : '#4477DD'
                                    }}
                                    onClick={() => toggleInvoice(order.invoice_ref)}
                                >
                                    {/* Invoice Header */}
                                    <div 
                                        style={{
                                            background: isAvoir 
                                                ? 'linear-gradient(135deg, #FFB800, #FF9900)'
                                                : isUnpaid 
                                                    ? 'linear-gradient(135deg, #FF4444, #FF2222)'
                                                    : 'linear-gradient(135deg, #599AED, #4477DD)'
                                        }}
                                        className="relative"
                                    >
                                        <div className="px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between relative z-10">
                                            {/* Mobile Layout */}
                                            <div className="flex flex-col gap-2 md:hidden">
                                                {/* Top Row - Invoice Number and Status */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-1.5">
                                                                <FaFileInvoice className="w-3 h-3 text-white/80" />
                                                                <span className="text-[10px] text-white/80 uppercase tracking-wider font-medium">
                                                                    Facture
                                                                </span>
                                                            </div>
                                                            <span className="text-white text-base font-bold mt-0.5">
                                                                {order.invoice_ref}
                                                            </span>
                                                        </div>
                                                        <div className={`
                                                            px-2 py-0.5 rounded-full text-[10px] font-medium
                                                            bg-white/20 text-white backdrop-blur-sm
                                                            flex items-center gap-1
                                                        `}>
                                                            {isAvoir ? (
                                                                <>
                                                                    <RiExchangeLine className="w-2.5 h-2.5" />
                                                                    <span>Avoir</span>
                                                                </>
                                                            ) : isUnpaid ? (
                                                                <>
                                                                    <RiErrorWarningLine className="w-2.5 h-2.5" />
                                                                    <span>Impayé</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <RiCheckboxCircleLine className="w-2.5 h-2.5" />
                                                                    <span>Payé</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-white font-bold text-base">
                                                            {order.total_invoice_amount} DH
                                                        </span>
                                                        {isUnpaid && (
                                                            <span className="text-white/80 text-[10px] font-medium">
                                                                Reste: {order.amount_unpaid} DH
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bottom Row - Info Grid */}
                                                <div className="grid grid-cols-3 gap-2">
                                                    {/* Date */}
                                                    <div className="bg-white/10 rounded-lg p-1.5">
                                                        <div className="flex items-center gap-1">
                                                            <FaCalendarAlt className="w-2.5 h-2.5 text-white/80" />
                                                            <span className="text-[9px] text-white/80 uppercase tracking-wider font-medium">
                                                                Date
                                                            </span>
                                                        </div>
                                                        <span className="text-white text-[11px] font-medium block mt-0.5">
                                                            {order.invoice_date}
                                                        </span>
                                                    </div>

                                                    {/* Commercial */}
                                                    <div className="bg-white/10 rounded-lg p-1.5">
                                                        <div className="flex items-center gap-1">
                                                            <FaUserTie className="w-2.5 h-2.5 text-white/80" />
                                                            <span className="text-[9px] text-white/80 uppercase tracking-wider font-medium">
                                                                Commercial
                                                            </span>
                                                        </div>
                                                        <span className="text-white text-[11px] font-medium block mt-0.5 truncate">
                                                            {order.commercial_name}
                                                        </span>
                                                    </div>

                                                    {/* Client */}
                                                    <div className="bg-white/10 rounded-lg p-1.5">
                                                        <div className="flex items-center gap-1">
                                                            <FaUser className="w-2.5 h-2.5 text-white/80" />
                                                            <span className="text-[9px] text-white/80 uppercase tracking-wider font-medium">
                                                                Client
                                                            </span>
                                                        </div>
                                                        <span className="text-white text-[11px] font-medium block mt-0.5 truncate">
                                                            {order.client_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Desktop Layout - Keep existing */}
                                            <div className="hidden md:flex items-center justify-between w-full desktop-header-bg">
                                                <div className="flex items-center gap-6" 
                                                    style={{
                                                        background: 'none',
                                                        backgroundColor: 'transparent'
                                                    }}
                                                >
                                                    {/* Invoice Number */}
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <FaFileInvoice className="w-3 h-3 text-white/80" />
                                                            <div className="text-[10px] text-white/80 uppercase tracking-wider">Facture</div>
                                                        </div>
                                                        <div className="text-white text-lg font-bold tracking-wide mt-1">{order.invoice_ref}</div>
                                                    </div>
                                                    {/* Date */}
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <FaCalendarAlt className="w-3 h-3 text-white/80" />
                                                            <div className="text-[10px] text-white/80 uppercase tracking-wider">Date</div>
                                                        </div>
                                                        <div className="text-white font-medium mt-1">{order.invoice_date}</div>
                                                    </div>
                                                    {/* Commercial */}
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <FaUserTie className="w-3 h-3 text-white/80" />
                                                            <div className="text-[10px] text-white/80 uppercase tracking-wider">Commercial</div>
                                                        </div>
                                                        <div className="text-white font-medium mt-1">{order.commercial_name}</div>
                                                    </div>
                                                </div>

                                                {/* Right Side - Show total and status badge */}
                                                {!isExpanded ? (
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex flex-col items-end">
                                                            <div className="text-white font-bold text-lg">
                                                                {order.total_invoice_amount} DH
                                                            </div>
                                                            {isUnpaid && (
                                                                <div className="text-white/80 text-xs">
                                                                    Reste: {order.amount_unpaid} DH
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className={`
                                                            px-2.5 py-1 rounded-full text-xs font-medium
                                                            bg-white/20 text-white backdrop-blur-sm
                                                        `}>
                                                            {isAvoir ? 'Avoir' : isUnpaid ? 'Impayé' : 'Payé'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-3">
                                                        <div className={`
                                                            px-2.5 py-1 rounded-full text-xs font-medium
                                                            bg-white/20 text-white backdrop-blur-sm
                                                        `}>
                                                            {isAvoir ? 'Avoir' : isUnpaid ? 'Impayé' : 'Payé'}
                                                        </div>
                                                        <div className="relative">
                                                            <div className={`
                                                                absolute inset-0 rounded-full
                                                                animate-[pulseRing_2s_ease-in-out_infinite]
                                                                ${isAvoir ? 'bg-amber-400' : isUnpaid ? 'bg-[#FF0000]' : 'bg-emerald-400'}
                                                            `}></div>
                                                            {isAvoir ? (
                                                                <RiExchangeLine className="w-5 h-5 text-white relative z-10" />
                                                            ) : isUnpaid ? (
                                                                <RiErrorWarningLine className="w-5 h-5 text-white relative z-10" />
                                                            ) : (
                                                                <RiCheckboxCircleLine className="w-5 h-5 text-white relative z-10" />
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expandable Content */}
                                    <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}
                                        style={{
                                            background: isAvoir 
                                                ? 'linear-gradient(to right, #FFF7ED, #FFFBEB)'
                                                : isUnpaid 
                                                    ? 'linear-gradient(to right, #FEF2F2, #FEE2E2)'
                                                    : 'linear-gradient(to right, #F0F9FF, #EFF6FF)'
                                        }}
                                    >
                                        {/* Client Info Section */}
                                        <div className="px-4 py-4 md:px-8">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                {/* Main Client Info Card */}
                                                <div className="flex-1 bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                                    <div className="flex items-start gap-3">
                                                        {/* Client Avatar/Icon */}
                                                        <div className="shrink-0">
                                                            <div style={{ 
                                                                background: isAvoir 
                                                                    ? 'linear-gradient(135deg, #FCD34D, #F59E0B)'
                                                                    : isUnpaid 
                                                                        ? 'linear-gradient(135deg, #FCA5A5, #EF4444)'
                                                                        : 'linear-gradient(135deg, #93C5FD, #3B82F6)'
                                                            }} 
                                                            className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm">
                                                                <FaUser className="w-4 h-4 text-white" />
                                                            </div>
                                                        </div>
                                                        
                                                        {/* Client Details */}
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className="text-sm font-semibold text-gray-900">{order.client_name}</span>
                                                                {order.client_ice && (
                                                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-600 text-[10px] font-medium rounded-full border border-gray-100">
                                                                        <div className="flex items-center gap-1">
                                                                            <FaInfoCircle className="w-2.5 h-2.5 text-gray-400" />
                                                                            ICE: {order.client_ice}
                                                                        </div>
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Contact Info & Stats */}
                                                            <div className="mt-2 flex flex-wrap items-center gap-2">
                                                                {order.client_phone && (
                                                                    <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
                                                                        <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                                            <FaPhone className="w-2.5 h-2.5 text-gray-500" />
                                                                        </div>
                                                                        <span className="text-xs text-gray-600">{order.client_phone}</span>
                                                                    </div>
                                                                )}
                                                                
                                                                {/* Articles Count */}
                                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
                                                                    <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                                                                        <FaBox className="w-2.5 h-2.5 text-gray-500" />
                                                                    </div>
                                                                    <span className="text-xs text-gray-600">{order.items.length} articles</span>
                                                                </div>

                                                                {/* Payment Status - Restyled with vibrant colors */}
                                                                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md border"
                                                                    style={{
                                                                        backgroundColor: isAvoir ? '#FFF7ED' : isUnpaid ? '#FEF2F2' : '#F0FDF4',
                                                                        borderColor: isAvoir ? '#F59E0B' : isUnpaid ? '#EF4444' : '#22C55E'
                                                                    }}
                                                                >
                                                                    <div className="relative">
                                                                        {isAvoir ? (
                                                                            <RiExchangeLine className="w-4 h-4 text-amber-600" />
                                                                        ) : isUnpaid ? (
                                                                            <RiErrorWarningLine className="w-4 h-4 text-red-600" />
                                                                        ) : (
                                                                            <RiCheckboxCircleLine className="w-4 h-4 text-emerald-600" />
                                                                        )}
                                                                    </div>
                                                                    <span className="text-xs font-medium"
                                                                        style={{
                                                                            color: isAvoir ? '#B45309' : isUnpaid ? '#B91C1C' : '#15803D'
                                                                        }}
                                                                    >
                                                                        {isAvoir ? 'Avoir' : isUnpaid ? 'Impayé' : 'Payé'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Private Note Card - if exists */}
                                                {order.private_note && (
                                                    <div className="flex-1 md:max-w-[300px]">
                                                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 h-full">
                                                            <div className="flex items-start gap-3">
                                                                {/* Note Icon */}
                                                                <div className="shrink-0">
                                                                    <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center">
                                                                        <FaClipboardList className="w-4 h-4 text-yellow-600" />
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Note Content */}
                                                                <div className="flex-1">
                                                                    <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                                                                        Note privée
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 bg-yellow-50 rounded-lg p-2 border border-yellow-100">
                                                                        {order.private_note}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Products Table */}
                                        <div className="px-4 py-4 md:px-8">
                                            <table className="w-full products-table">
                                                <thead>
                                                    <tr className="text-xs text-gray-500 border-b">
                                                        <th className="pb-2 font-bold text-left">
                                                            <div className="flex items-center gap-1.5">
                                                                <FaBox className="w-3 h-3" />
                                                                Article
                                                            </div>
                                                        </th>
                                                        <th className="pb-2 font-bold text-center w-20 hidden md:table-cell">Qté</th>
                                                        <th className="pb-2 font-bold text-right w-32 hidden md:table-cell">Prix Unit.</th>
                                                        <th className="pb-2 font-bold text-right w-32">Total TTC</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {items.map((item, idx) => {
                                                        const qty = parseFloat(item.qty_sold);
                                                        const totalTTC = parseFloat(item.product_price_ttc?.toString().replace(/[^\d.-]/g, '') || 0);
                                                        const unitPrice = qty > 0 ? totalTTC / qty : 0;
                                                        
                                                        return (
                                                            <tr key={idx} className="border-b border-gray-100 last:border-0">
                                                                <td className="py-2">
                                                                    <div className="font-medium text-gray-900">
                                                                        {decodeHtmlEntities(item.product_label)}
                                                                    </div>
                                                                    {item.product_ref && (
                                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                                            Réf: {item.product_ref}
                                                                        </div>
                                                                    )}
                                                                    {item.invoice_description && item.invoice_description !== item.product_label && (
                                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                                            {decodeHtmlEntities(item.invoice_description)}
                                                                        </div>
                                                                    )}
                                                                </td>
                                                                <td className="py-2 text-center text-gray-900 hidden md:table-cell">{qty}</td>
                                                                <td className="py-2 text-right text-gray-900 hidden md:table-cell">{item.unit_price} DH</td>
                                                                <td className="py-2 text-right font-medium text-gray-900">
                                                                    {item.product_price_ttc} DH
                                                                    {width < 768 && (
                                                                        <div className="text-xs text-gray-500 mt-0.5">
                                                                            ({qty} pcs)
                                                                        </div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>

                                        {/* Totals Section at the bottom */}
                                        <div className="flex items-center justify-between py-3 px-4 md:px-8"
                                            style={{
                                                backgroundColor: isAvoir 
                                                    ? '#FF9900'  // Amber for Avoir
                                                    : isUnpaid 
                                                        ? '#FF4444'  // Red for Unpaid
                                                        : '#599AED', // Blue for Paid
                                                color: 'white'
                                            }}
                                        >
                                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white/80 text-sm">Payé:</span>
                                                    <span className="text-white font-medium">{order.amount_paid} DH</span>
                                                </div>
                                                {parseFloat(order.amount_unpaid) > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-white/80 text-sm">Reste:</span>
                                                        <span className="text-white font-medium">{order.amount_unpaid} DH</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white/80 text-sm">Total TTC:</span>
                                                <span className="text-white font-bold text-lg">{order.total_invoice_amount} DH</span>
                                            </div>
                                        </div>

                                        {/* Payment Details Section */}
                                        {order.payment_details && (
                                            <div className="px-4 py-4 md:px-8">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="p-1 bg-emerald-50 rounded">
                                                        <FaCreditCard className="w-3 h-3 text-emerald-500" />
                                                    </div>
                                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        Historique des paiements
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {order.payment_details.split(', ').map((payment, idx) => {
                                                        const [method, amount, date] = payment.split(': ');
                                                        
                                                        return (
                                                            <div 
                                                                key={idx} 
                                                                style={{
                                                                    background: isAvoir 
                                                                        ? 'linear-gradient(135deg, #FFB800, #FF9900)'
                                                                        : isUnpaid 
                                                                            ? 'linear-gradient(135deg, #FF4444, #FF2222)'
                                                                            : 'linear-gradient(135deg, #599AED, #4477DD)'
                                                                }}
                                                                className="flex items-center gap-3 px-3 py-2 rounded-lg shadow-[0_4px_10px_-4px_rgba(0,0,0,0.3)]"
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <div className="bg-white/20 p-1 rounded backdrop-blur-sm">
                                                                        <FaMoneyBillWave className="w-3 h-3 text-white" />
                                                                    </div>
                                                                    <span className="text-xs font-medium text-white">{method}</span>
                                                                </div>
                                                                <div className="h-4 w-px bg-white/20"></div>
                                                                <span className="text-xs font-semibold text-white">{amount}</span>
                                                                {date && (
                                                                    <>
                                                                        <div className="h-4 w-px bg-white/20"></div>
                                                                        <span className="text-xs text-white/80">
                                                                            {date.replace(/[()]/g, '')}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
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

                {/* Bottom Pagination */}
                {totalItems > 0 && (
                    <PaginationComponent
                        current={currentPage}
                        total={totalItems}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                )}
            </div>
            <style jsx global>{`
                .products-table,
                .products-table thead,
                .products-table tbody,
                .products-table tr,
                .products-table th,
                .products-table td {
                    background: transparent !important;
                }

                @media (min-width: 768px) {
                    .md\\:justify-between {
                        --header-bg: transparent;
                    }
                }

                .desktop-header-bg {
                    background-color: rgba(90, 155, 237, 0) !important;
                }
                .desktop-header-bg > div {
                    background-color: rgba(90, 155, 237, 0) !important;
                }
            `}</style>
        </>
    );
};

// Loading skeleton component
const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
                <div className="h-32 bg-gray-100 rounded-lg">
                    <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
export default OrdersList;
