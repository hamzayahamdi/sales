import { useState, useEffect, useMemo } from 'react';
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

    const fetchOrders = async () => {
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

                // Check if all search terms are found in the product info
                return searchTerms.every(term => productInfo.includes(term));
            });

            // Return true if either order info or product info matches all search terms
            return searchTerms.every(term => orderInfo.includes(term)) || hasMatchingProduct;
        });
    }, [orders, searchTerm]);

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
                                    ${isExpanded ? 'bg-[#599AED]/30' : 
                                      isAvoir ? 'bg-[#FF9900]/30' :  
                                      isUnpaid ? 'bg-[#FF4444]/30' :  
                                      'bg-[#F3F3F8]'
                                    } 
                                    rounded-lg overflow-hidden transition-all duration-300
                                    border border-gray-200
                                    ${isAvoir ? 'hover:border-[#FF9900]' : ''}
                                    ${!isAvoir && isUnpaid ? 'hover:border-[#FF4444]' : ''}
                                `}
                            >
                                <div 
                                    className={`flex items-center justify-between p-4 cursor-pointer
                                        ${!isExpanded ? (
                                            isAvoir ? 'hover:bg-[#FF9900]/30' : 
                                            isUnpaid ? 'hover:bg-[#FF4444]/30' : 
                                            'hover:bg-[#599AED]/30'  // Increased opacity for hover
                                        ) : (
                                            isAvoir ? 'bg-[#FF9900]/30' : 
                                            isUnpaid ? 'bg-[#FF4444]/30' : 
                                            'bg-[#599AED]/30'  // Header matches the expanded content background
                                        )}`}
                                    onClick={() => handleExpand(order.invoice_ref)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900 text-xs md:text-base">{order.invoice_ref}</span>
                                            <span className="text-[10px] md:text-xs text-gray-500">{order.invoice_date}</span>
                                        </div>
                                        <div className="flex flex-col max-w-[150px] md:max-w-none">
                                            <span className="font-medium text-gray-900 text-xs md:text-base truncate">{order.client_name}</span>
                                            <span className="text-[10px] md:text-xs text-gray-500 flex items-center gap-1">
                                                <FaPhone className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                                <span className="truncate">{order.client_phone || 'N/A'}</span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 md:gap-6">
                                        <div className="flex flex-col items-end">
                                            <div className="flex flex-col items-end gap-1">
                                                <span className={`font-medium text-xs md:text-base ${isAvoir ? 'text-[#FF9900]' : 'text-gray-900'}`}>
                                                    {order.total_invoice_amount} DH
                                                </span>
                                                <div className="flex items-center gap-1">
                                                    {isAvoir && (
                                                        <span className="px-1.5 md:px-2 py-0.5 text-[10px] md:text-xs font-medium rounded-full 
                                                            bg-[#FF9900] text-white"
                                                        >
                                                            AVOIR
                                                        </span>
                                                    )}
                                                    {getPaymentStatus(order)}
                                                </div>
                                            </div>
                                            {parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 && (
                                                <div className="text-[10px] md:text-xs text-[#ef4444] mt-1">
                                                    Reliquat: -{order.amount_unpaid} DH
                                                </div>
                                            )}
                                        </div>
                                        <i className={`icon-chevron-down-regular text-gray-400 transition-transform ${expandedInvoice === order.invoice_ref ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Order Details - Update the animation */}
                                <Transition
                                    show={expandedInvoice === order.invoice_ref}
                                    enter="transition-all duration-300 ease-out"
                                    enterFrom="transform scale-y-0 opacity-0 origin-top"
                                    enterTo="transform scale-y-100 opacity-100 origin-top"
                                    leave="transition-all duration-200 ease-in"
                                    leaveFrom="transform scale-y-100 opacity-100 origin-top"
                                    leaveTo="transform scale-y-0 opacity-0 origin-top"
                                >
                                    <div className={`
                                        border-t border-gray-200 p-4 
                                        ${isAvoir ? 'bg-[#FF9900]/30' : 
                                          isUnpaid ? 'bg-[#FF4444]/30' : 
                                          'bg-[#599AED]/30'}
                                    `}>
                                        {/* Products Table */}
                                        <table className="w-full text-sm md:text-base">
                                            <thead>
                                                <tr className="text-[10px] md:text-xs text-gray-500 uppercase">
                                                    <th className="text-left py-2 hidden md:table-cell">Réf.</th>
                                                    <th className="text-left py-2">Produit</th>
                                                    <th className="text-right py-2">Qté</th>
                                                    <th className="text-right py-2 min-w-[90px]">Prix TTC</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                                {order.items.map((item, index) => (
                                                    <tr key={index} className="text-xs md:text-sm">
                                                        <td className={`py-2 text-gray-500 hidden md:table-cell`}>
                                                            {item.product_ref || '-'}
                                                        </td>
                                                        <td className={`py-2 text-gray-900 pr-2`}>
                                                            {item.product_ref ? (
                                                                decodeHtmlEntities(item.product_label)
                                                            ) : (
                                                                <span className="italic text-gray-900">
                                                                    {decodeHtmlEntities(item.invoice_description || item.product_label)}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className={`py-2 text-right text-gray-900 px-2`}>
                                                            {item.qty_sold}
                                                        </td>
                                                        <td className={`py-2 text-right text-gray-900 whitespace-nowrap`}>
                                                            {item.product_price_ttc} DH
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Payment Details and Notes */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                                            {order.payment_details && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Paiements:</span>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {order.payment_details.split(', ').map((payment, idx) => {
                                                            const [method, amount, date] = payment.split(': ');
                                                            if (!method || !amount) return null;
                                                            
                                                            const paymentInfo = {
                                                                'Carte bancaire': { icon: FaCreditCard, color: '#22DD66' },
                                                                'Espèce': { icon: FaMoneyBillWave, color: '#599AED' },
                                                                'Virement': { icon: FaUniversity, color: '#FF9900' },
                                                                'Chèque': { icon: FaMoneyCheck, color: '#9933FF' }
                                                            }[method] || { icon: FaMoneyBillWave, color: '#599AED' };
                                                            
                                                            const PaymentIcon = paymentInfo.icon;
                                                            
                                                            return (
                                                                <div 
                                                                    key={idx}
                                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                                                                    style={{
                                                                        backgroundColor: paymentInfo.color,
                                                                        color: 'white'
                                                                    }}
                                                                >
                                                                    <PaymentIcon className="w-4 h-4 text-white" />
                                                                    <span>{method}</span>
                                                                    {amount && <span>{amount}</span>}
                                                                    {date && (
                                                                        <span className="text-xs text-white/80">
                                                                            ({date})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 && (
                                                <div className="text-sm flex items-center gap-2">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FF4444] text-white">
                                                        <span>Reliquat:</span>
                                                        <span>-{order.amount_unpaid} DH</span>
                                                    </div>
                                                </div>
                                            )}
                                            {order.private_note && (
                                                <div className="text-sm">
                                                    <span className="text-gray-500">Notes:</span>
                                                    <p className="text-gray-900 mt-1">{order.private_note}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                                            <div className="text-sm text-gray-500 flex items-center gap-4">
                                                <div>
                                                    Commercial: <span className="text-gray-900">{order.commercial_name}</span>
                                                </div>
                                                <div>
                                                    ICE: <span className="text-gray-900">{order.client_ice || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <a 
                                                href={order.pdf_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[#599AED] hover:text-[#4080d4]"
                                            >
                                                <i className="icon-file-pdf-regular text-lg" />
                                            </a>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrdersList;