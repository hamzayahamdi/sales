import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useWindowSize } from 'react-use';
import BasicTable from '@components/BasicTable';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport, FaFileInvoice, FaPhone, FaUser, FaUserTie, FaCalendarAlt, FaBox, FaClipboardList, FaInfoCircle, FaExchangeAlt, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { Transition } from '@headlessui/react';
import { RiCheckboxCircleLine, RiErrorWarningLine, RiExchangeLine } from 'react-icons/ri';

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
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedInvoice, setExpandedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const scrollContainerRef = useRef(null);
    const [expandedInvoices, setExpandedInvoices] = useState(new Set());

    const counters = useMemo(() => {
        return {
            all: orders.length,
            paye: orders.filter(order => {
                const amount = parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, ''));
                const unpaidAmount = parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, ''));
                return amount >= 0 && unpaidAmount <= 0;
            }).length,
            impaye: orders.filter(order => {
                const unpaidAmount = parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, ''));
                return unpaidAmount > 0;
            }).length,
            avoir: orders.filter(order => {
                const amount = parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, ''));
                return amount < 0;
            }).length
        };
    }, [orders]);

    const filteredOrders = useMemo(() => {
        let filtered = orders;
        
        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => {
                const amount = parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, ''));
                const unpaidAmount = parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, ''));
                
                switch (statusFilter) {
                    case 'avoir':
                        return amount < 0;
                    case 'impaye':
                        return unpaidAmount > 0;
                    case 'paye':
                        return amount >= 0 && unpaidAmount <= 0;
                    default:
                        return true;
                }
            });
        }

        // Apply search filter
        if (searchTerm) {
            const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
            
            filtered = filtered.filter(order => {
                const orderInfo = [
                    order.invoice_ref.toLowerCase(),
                    order.client_name.toLowerCase(),
                    order.client_phone?.toLowerCase(),
                    order.commercial_name.toLowerCase()
                ].join(' ');

                const hasMatchingProduct = order.items.some(item => {
                    const productInfo = [
                        item.product_label?.toLowerCase(),
                        item.product_ref?.toLowerCase(),
                        item.invoice_description?.toLowerCase()
                    ].filter(Boolean).join(' ');

                    return searchTerms.every(term => productInfo.includes(term));
                });

                return searchTerms.every(term => orderInfo.includes(term)) || hasMatchingProduct;
            });
        }

        return filtered;
    }, [orders, searchTerm, statusFilter]);

    const fetchOrders = async () => {
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

            const data = await response.json();
            
            if (data.sales) {
                const groupedOrders = data.sales.reduce((acc, order) => {
                    if (!acc[order.invoice_ref]) {
                        acc[order.invoice_ref] = {
                            invoice_ref: order.invoice_ref,
                            invoice_date: order.invoice_date,
                            client_name: order.client_name,
                            client_phone: order.client_phone,
                            client_ice: order.client_ice,
                            commercial_name: order.commercial_name,
                            total_invoice_amount: order.total_invoice_amount,
                            amount_paid: order.amount_paid,
                            amount_unpaid: order.amount_unpaid,
                            pdf_link: order.pdf_link,
                            payment_details: order.payment_details,
                            private_note: order.private_note,
                            items: []
                        };
                    }
                    acc[order.invoice_ref].items.push({
                        product_ref: order.product_ref,
                        product_label: order.product_label,
                        invoice_description: order.invoice_description,
                        qty_sold: order.qty_sold,
                        product_price_ttc: order.product_price_ttc
                    });
                    return acc;
                }, {});

                setOrders(Object.values(groupedOrders));
                setDisplayedOrders(Object.values(groupedOrders));
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [storeId, dateRange]);

    const handleExpand = (invoiceRef) => {
        setExpandedInvoice(expandedInvoice === invoiceRef ? null : invoiceRef);
    };

    const getPaymentStatus = (order) => {
        if (parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, '')) < 0) {
            return null;
        }

        const unpaidAmount = parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, ''));
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
            'Status': parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 ? 'Non payé' : 'Payé'
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

    if (isLoading) {
        return (
            <div className="flex flex-col h-[700px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
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
            <div className="flex flex-col h-[900px] p-4 xs:p-5 bg-white shadow-lg rounded-xl">
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
                        onClick={() => setStatusFilter('all')}
                        style={{
                            backgroundColor: statusFilter === 'all' ? '#599AED' : '#F3F3F8',
                            color: statusFilter === 'all' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'all' ? '0 4px 6px -1px rgba(89, 154, 237, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Tous</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{counters.all}</span>
                    </button>
                    <button
                        onClick={() => setStatusFilter('paye')}
                        style={{
                            backgroundColor: statusFilter === 'paye' ? '#22DD66' : '#F3F3F8',
                            color: statusFilter === 'paye' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'paye' ? '0 4px 6px -1px rgba(34, 221, 102, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Payé</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{counters.paye}</span>
                    </button>
                    <button
                        onClick={() => setStatusFilter('impaye')}
                        style={{
                            backgroundColor: statusFilter === 'impaye' ? '#FF4444' : '#F3F3F8',
                            color: statusFilter === 'impaye' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'impaye' ? '0 4px 6px -1px rgba(255, 68, 68, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Impayé</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{counters.impaye}</span>
                    </button>
                    <button
                        onClick={() => setStatusFilter('avoir')}
                        style={{
                            backgroundColor: statusFilter === 'avoir' ? '#FFB800' : '#F3F3F8',
                            color: statusFilter === 'avoir' ? 'white' : '#4A5568',
                            boxShadow: statusFilter === 'avoir' ? '0 4px 6px -1px rgba(255, 184, 0, 0.3)' : 'none'
                        }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center gap-2"
                    >
                        <span>Avoir</span>
                        <span className="px-1.5 py-0.5 bg-white/20 rounded text-[11px]">{counters.avoir}</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto" ref={scrollContainerRef}>
                    <div className="grid grid-cols-1 gap-4 px-0">
                        {filteredOrders.map((order) => {
                            const isAvoir = parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, '')) < 0;
                            const isUnpaid = parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0;
                            const isExpanded = expandedInvoices.has(order.invoice_ref);
                            
                            return (
                                <div 
                                    key={order.invoice_ref}
                                    className={`relative overflow-hidden rounded-lg mx-0
                                        transition-all duration-300
                                        ${isExpanded ? 'mb-8' : ''}
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
                                                {/* Top Row - Invoice Number, Status and Amount */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-1.5">
                                                                <FaFileInvoice className="w-2.5 h-2.5 text-white/80" />
                                                                <div className="text-[9px] text-white/80 uppercase tracking-wider">Facture</div>
                                                            </div>
                                                            <div className="text-white text-base font-bold tracking-wide mt-0.5">{order.invoice_ref}</div>
                                                        </div>
                                                        <div className={`
                                                            px-2 py-0.5 rounded-full text-[11px] font-medium
                                                            bg-white/20 text-white backdrop-blur-sm
                                                        `}>
                                                            {isAvoir ? 'Avoir' : isUnpaid ? 'Impayé' : 'Payé'}
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end">
                                                        <div className="text-white font-bold text-base">
                                                            {order.total_invoice_amount} DH
                                                        </div>
                                                        {isUnpaid && (
                                                            <div className="text-white/80 text-[10px]">
                                                                Reste: {order.amount_unpaid} DH
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Bottom Row - Date and Commercial */}
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <FaCalendarAlt className="w-2.5 h-2.5 text-white/80" />
                                                                <div className="text-[9px] text-white/80 uppercase tracking-wider">Date</div>
                                                            </div>
                                                            <div className="text-white text-xs font-medium mt-0.5">{order.invoice_date}</div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1">
                                                                <FaUserTie className="w-2.5 h-2.5 text-white/80" />
                                                                <div className="text-[9px] text-white/80 uppercase tracking-wider">Commercial</div>
                                                            </div>
                                                            <div className="text-white text-xs font-medium mt-0.5">{order.commercial_name}</div>
                                                        </div>
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
                                        <div className="px-8 py-4">
                                            <div className="flex items-start gap-6">
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
                                                            <div className="flex items-center gap-2">
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

                                                                {/* Payment Status - Restyled with vibrant red */}
                                                                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md border border-gray-100">
                                                                    <div className="relative">
                                                                        <div className={`
                                                                            absolute inset-0 rounded-full
                                                                            animate-[pulseRing_2s_ease-in-out_infinite]
                                                                            ${isAvoir ? 'bg-amber-100' : isUnpaid ? 'bg-red-100' : 'bg-emerald-100'}
                                                                        `}></div>
                                                                        {isAvoir ? (
                                                                            <RiExchangeLine className={`w-4 h-4 text-amber-600 relative z-10`} />
                                                                        ) : isUnpaid ? (
                                                                            <RiErrorWarningLine className={`w-4 h-4 text-[#FF0000] relative z-10`} />
                                                                        ) : (
                                                                            <RiCheckboxCircleLine className={`w-4 h-4 text-emerald-600 relative z-10`} />
                                                                        )}
                                                                    </div>
                                                                    <span className={`
                                                                        text-xs
                                                                        ${isAvoir 
                                                                            ? 'text-amber-600' 
                                                                            : isUnpaid 
                                                                                ? 'text-[#FF0000]' 
                                                                                : 'text-emerald-600'
                                                                        }
                                                                    `}>
                                                                        {isAvoir ? 'Avoir' : isUnpaid ? 'Impayé' : 'Payé'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Private Note Card - if exists */}
                                                {order.private_note && (
                                                    <div className="flex-1">
                                                        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                                                            <div className="flex items-start gap-3">
                                                                {/* Note Icon */}
                                                                <div className="shrink-0">
                                                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                                                                        <FaClipboardList className="w-4 h-4 text-gray-400" />
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Note Content */}
                                                                <div className="flex-1">
                                                                    <div className="text-[10px] font-medium text-gray-500 uppercase tracking-wider mb-1">
                                                                        Note privée
                                                                    </div>
                                                                    <div className="text-xs text-gray-600 bg-gray-50 rounded-lg p-2 border border-gray-100">
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
                                        <div className="px-8 py-4">
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
                                                    {order.items.map((item, idx) => {
                                                        const qty = parseFloat(item.qty_sold);
                                                        const totalTTC = parseFloat(item.product_price_ttc.replace(/[^\d.-]/g, ''));
                                                        const unitPrice = totalTTC / qty;
                                                        
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
                                                                <td className="py-2 text-right text-gray-900 hidden md:table-cell">{unitPrice.toFixed(2)} DH</td>
                                                                <td className="py-2 text-right font-medium text-gray-900">
                                                                    {totalTTC.toFixed(2)} DH
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

                                        {/* Totals Section */}
                                        <div 
                                            style={{
                                                background: isAvoir 
                                                    ? 'linear-gradient(135deg, #FFB800, #FF9900)'
                                                    : isUnpaid 
                                                        ? 'linear-gradient(135deg, #FF4444, #FF2222)'
                                                        : 'linear-gradient(135deg, #599AED, #4477DD)'
                                            }}
                                            className="mt-3 px-8 py-3 flex justify-between items-center"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="text-white/80 text-sm">Payé:</div>
                                                    <div className="text-white font-medium">{order.amount_paid} DH</div>
                                                </div>
                                                {parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-white/80 text-sm">Reste:</div>
                                                        <div className="text-white font-medium">{order.amount_unpaid} DH</div>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="text-white/80 text-sm">Total TTC:</div>
                                                <div className="text-white font-bold text-lg">{order.total_invoice_amount} DH</div>
                                            </div>
                                        </div>

                                        {/* Payment Details Section */}
                                        {order.payment_details && (
                                            <div className="px-8 py-4">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="p-1 bg-emerald-50 rounded">
                                                        <FaCreditCard className="w-3 h-3 text-emerald-500" />
                                                    </div>
                                                    <div className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                                                        Historique des paiements
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2 ml-6">
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
                    <div className="h-12"></div>
                </div>
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

export default OrdersList;