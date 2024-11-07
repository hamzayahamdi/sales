import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWindowSize } from 'react-use';
import BasicTable from '@components/BasicTable';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport, FaFileInvoice, FaPhone } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { Transition } from '@headlessui/react';

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
        .replace(/&amp;/g, '&');
};

const OrdersList = ({ dateRange, storeId }) => {
    const { width } = useWindowSize();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedInvoice, setExpandedInvoice] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedOrders, setDisplayedOrders] = useState([]);

    const filteredOrders = useMemo(() => {
        if (!searchTerm) return orders;
        
        const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term.length > 0);
        
        return orders.filter(order => {
            // Basic order info search
            const orderInfo = [
                order.invoice_ref.toLowerCase(),
                order.client_name.toLowerCase(),
                order.client_phone?.toLowerCase(),
                order.commercial_name.toLowerCase()
            ].join(' ');

            // Product search with combinations
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
    }, [orders, searchTerm]);

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            const formattedDateRange = Array.isArray(dateRange) 
                ? `${dateRange[0].format('DD/MM/YYYY')} - ${dateRange[1].format('DD/MM/YYYY')}`
                : dateRange;

            formData.append('date_range', formattedDateRange);
            formData.append('store_id', storeId);

            const response = await fetch('http://phpstack-937973-4538369.cloudwaysapps.com/fetch_sales_new.php', {
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
        <div className="flex flex-col h-[700px] p-4 xs:p-5 bg-white shadow-lg rounded-xl">
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
                    {filteredOrders.map((order) => {
                        const isAvoir = parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, '')) < 0;
                        const isUnpaid = parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0;
                        const isExpanded = expandedInvoice === order.invoice_ref;
                        
                        return (
                            <div 
                                key={order.invoice_ref} 
                                className={`
                                    mb-4 overflow-hidden transition-all duration-300 border
                                    ${isExpanded ? 'shadow-lg rounded-xl' : 'shadow-sm rounded-lg hover:shadow-md'}
                                    ${isAvoir ? 'bg-[#FFF8E6] border-[#FFB800]' : 
                                      isUnpaid ? 'bg-[#FFF1F1] border-[#FF4444]' : 
                                      'bg-[#EDF5FF] border-[#599AED]'}
                                `}
                            >
                                <div className="flex flex-col">
                                    {/* Header Section */}
                                    <div className={`
                                        flex items-center justify-between px-3 py-2.5
                                        ${isAvoir ? 'bg-[#FFB800]' : 
                                         isUnpaid ? 'bg-[#FF4444]' : 
                                         'bg-[#599AED]'}
                                    `}>
                                        <div className="flex items-center gap-2">
                                            <div className={`
                                                px-2 py-0.5 md:px-2.5 md:py-1 rounded text-[10px] md:text-xs font-medium uppercase text-white
                                                ${isAvoir ? 'bg-[#FFB800] shadow-[0_0_10px_#FFB800]' : 
                                                 isUnpaid ? 'bg-[#DC2626] shadow-[0_0_10px_#DC2626]' : 
                                                 'bg-[#22C55E] shadow-[0_0_10px_#22C55E]'}
                                            `}>
                                                {isAvoir ? 'Avoir' : isUnpaid ? 'Impayé' : 'Payé'}
                                            </div>
                                            <div className="text-[10px] text-white/90">
                                                {order.invoice_date}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-xs md:text-sm text-white">
                                                {order.total_invoice_amount} DH
                                            </div>
                                            {parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 && (
                                                <div className="text-[10px] md:text-xs bg-[#DC2626] text-white px-2 py-0.5 rounded 
                                                    shadow-[0_0_10px_#DC2626] animate-pulse">
                                                    -{order.amount_unpaid} DH
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Main Content - Clickable */}
                                    <div 
                                        className={`px-3 py-2.5 cursor-pointer
                                            ${isAvoir ? 'hover:bg-[#FFF8E6]' : 
                                             isUnpaid ? 'hover:bg-[#FFF1F1]' : 
                                             'hover:bg-[#EDF5FF]'}
                                        `}
                                        onClick={() => handleExpand(order.invoice_ref)}
                                    >
                                        <div className="flex justify-between items-start gap-2">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-1">
                                                    <span className="text-[11px] md:text-sm text-gray-900">
                                                        {order.invoice_ref}
                                                    </span>
                                                    <span className={`
                                                        text-[10px] md:text-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded text-white
                                                        ${isAvoir ? 'bg-[#FF9900] shadow-[0_0_15px_rgba(255,153,0,0.4)]' : 
                                                         isUnpaid ? 'bg-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,0.4)]' : 
                                                         'bg-[#599AED] shadow-[0_0_15px_rgba(89,154,237,0.4)]'}
                                                    `}>
                                                        {order.commercial_name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-600">
                                                    <span className="truncate max-w-[120px] md:max-w-[200px]">{order.client_name}</span>
                                                    {order.client_phone && (
                                                        <span className="flex items-center gap-1 shrink-0">
                                                            <FaPhone className="w-2.5 h-2.5" />
                                                            <span className="truncate max-w-[80px] md:max-w-[150px]">{order.client_phone}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="shrink-0 w-6 h-6 flex items-center justify-center">
                                                <i className={`icon-chevron-down-regular text-gray-400 transition-transform ${
                                                    isExpanded ? 'rotate-180' : ''
                                                }`} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details - Products Section */}
                                    <Transition show={isExpanded}>
                                        <div className="border-t border-gray-200">
                                            <div className="p-3 bg-white/50">
                                                <div className="text-[10px] md:text-sm font-medium text-gray-500 mb-2 uppercase">
                                                    Produits
                                                </div>
                                                <div className="space-y-1.5">
                                                    {order.items.map((item, index) => (
                                                        <div key={index} className="flex items-center justify-between p-2 rounded bg-white text-[10px] md:text-xs">
                                                            <div className="flex-1 min-w-0 pr-2">
                                                                <div className="text-gray-900 truncate">
                                                                    {decodeHtmlEntities(item.product_label || item.invoice_description)}
                                                                </div>
                                                                {item.product_ref && (
                                                                    <div className="text-gray-500 text-[9px] md:text-[11px]">
                                                                        Réf: {item.product_ref}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-3 shrink-0">
                                                                <div className="text-gray-500">
                                                                    Qté: {item.qty_sold}
                                                                </div>
                                                                <div className="font-medium text-gray-900">
                                                                    {item.product_price_ttc} DH
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Payment Details Section */}
                                            {order.payment_details && (
                                                <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                                                    <div className="text-xs font-medium text-gray-500 mb-3 uppercase">
                                                        Détails de paiement
                                                    </div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {order.payment_details.split(', ').map((payment, idx) => {
                                                            const [method, amount, date] = payment.split(': ');
                                                            if (!method || !amount) return null;
                                                            
                                                            const paymentInfo = PAYMENT_ICONS[method] || { 
                                                                icon: FaMoneyBillWave, 
                                                                color: '#599AED' 
                                                            };
                                                            
                                                            const PaymentIcon = paymentInfo.icon;
                                                            
                                                            return (
                                                                <div 
                                                                    key={idx}
                                                                    className={`
                                                                        flex items-center gap-3 px-3 py-2 rounded-lg
                                                                        ${isAvoir ? 'bg-[#FF9900] shadow-[0_0_15px_rgba(255,153,0,0.35)]' : 
                                                                         isUnpaid ? 'bg-[#FF4444] shadow-[0_0_15px_rgba(255,68,68,0.35)]' : 
                                                                         'bg-[#599AED] shadow-[0_0_15px_rgba(89,154,237,0.35)]'}
                                                                    `}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <PaymentIcon className="w-4 h-4 text-white" />
                                                                        <span className="text-[10px] md:text-xs text-white/90 font-medium uppercase">
                                                                            {method}
                                                                        </span>
                                                                    </div>
                                                                    <div className="h-4 w-[1px] bg-white/20" />
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs md:text-sm text-white font-medium">
                                                                            {amount}
                                                                        </span>
                                                                        {date && (
                                                                            <>
                                                                                <div className="h-3 w-[1px] bg-white/20" />
                                                                                <span className="text-[10px] text-white/70">
                                                                                    {date.replace(/[()]/g, '')}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Notes Section */}
                                            {order.private_note && (
                                                <div className="px-4 py-3 border-t border-gray-200 bg-white/50">
                                                    <div className="text-xs font-medium text-gray-500 mb-3 uppercase">
                                                        Notes
                                                    </div>
                                                    <div className={`
                                                        text-sm text-gray-600 p-3 rounded-lg border
                                                        ${isAvoir ? 'bg-amber-50 border-amber-200' : 
                                                         isUnpaid ? 'bg-red-50 border-red-200' : 
                                                         'bg-emerald-50 border-emerald-200'}
                                                    `}>
                                                        {order.private_note}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Transition>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrdersList;