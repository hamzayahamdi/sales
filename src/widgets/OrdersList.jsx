import { useState, useEffect, useMemo } from 'react';
import { useWindowSize } from 'react-use';
import BasicTable from '@components/BasicTable';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport, FaFileInvoice } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const PAYMENT_ICONS = {
    'Carte bancaire': { icon: FaCreditCard, color: '#22c55e' },
    'Espèce': { icon: FaMoneyBillWave, color: '#3b82f6' },
    'Virement': { icon: FaUniversity, color: '#f59e0b' },
    'Chèque': { icon: FaMoneyCheck, color: '#8b5cf6' }
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
                    border border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10
                    shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]
                    transition-shadow"
                >
                    Non payé
                </span>
            );
        }

        return (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10
                shadow-[0_0_10px_rgba(34,197,94,0.3)] hover:shadow-[0_0_15px_rgba(34,197,94,0.4)]
                transition-shadow"
            >
                Payé
            </span>
        );
    };

    const filteredOrders = useMemo(() => {
        if (!searchTerm) return orders;
        
        return orders.filter(order => 
            order.invoice_ref.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.client_phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.commercial_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
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
            <div className="flex flex-col h-[400px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Liste des factures</h2>
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-pulse space-y-4 w-full">
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                        <div className="h-10 bg-[#111827] rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[700px] p-4 xs:p-5 bg-[#1F2937] shadow-lg rounded-xl">
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
                    <FaFileInvoice className="text-lg text-blue-400" />
                    Liste des factures
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
                                className={`${isExpanded ? 'bg-black' : 'bg-[#111827]'} rounded-lg overflow-hidden transition-all duration-300
                                    ${isAvoir ? 'border border-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]' : ''}
                                    ${!isAvoir && isUnpaid ? 'border border-[#ef4444] shadow-[0_0_10px_rgba(239,68,68,0.3)] hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}
                                `}
                            >
                                <div 
                                    className={`flex items-center justify-between p-4 cursor-pointer
                                        ${!isExpanded ? (
                                            isAvoir ? 'hover:bg-[#f59e0b]/5' : 
                                            isUnpaid ? 'hover:bg-[#ef4444]/5' : 
                                            'hover:bg-[#1a2942]'
                                        ) : ''}`}
                                    onClick={() => handleExpand(order.invoice_ref)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-300">{order.invoice_ref}</span>
                                            <span className="text-xs text-gray-500">{order.invoice_date}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-300">{order.client_name}</span>
                                            <span className="text-xs text-gray-500">
                                                {order.client_phone || 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center gap-2 md:flex-row flex-col">
                                                <div className="flex items-center gap-2">
                                                    {isAvoir && (
                                                        <span className="px-2 py-0.5 text-xs font-medium rounded-full 
                                                            border border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10
                                                            shadow-[0_0_10px_rgba(245,158,11,0.3)] hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]
                                                            transition-shadow"
                                                        >
                                                            AVOIR
                                                        </span>
                                                    )}
                                                    <span className={`font-medium ${isAvoir ? 'text-[#f59e0b]' : 'text-gray-300'}`}>
                                                        {order.total_invoice_amount} DH
                                                    </span>
                                                </div>
                                                <div className="md:inline-block">
                                                    {getPaymentStatus(order)}
                                                </div>
                                            </div>
                                            {parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 && (
                                                <div className="hidden md:block text-xs text-[#ef4444] mt-1">
                                                    Reliquat: -{order.amount_unpaid} DH
                                                </div>
                                            )}
                                        </div>
                                        <i className={`icon-chevron-down-regular text-gray-400 transition-transform ${expandedInvoice === order.invoice_ref ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                {/* Invoice Details */}
                                {expandedInvoice === order.invoice_ref && (
                                    <div className={`border-t p-4 ${
                                        isAvoir ? 'border-[#f59e0b]/20' : 
                                        isUnpaid ? 'border-[#ef4444]/20' : 
                                        'border-[#1F2937]'
                                    }`}>
                                        {/* Products Table */}
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-xs text-gray-400 uppercase">
                                                    <th className="text-left py-2">Réf.</th>
                                                    <th className="text-left py-2">Produit</th>
                                                    <th className="text-right py-2">Qté</th>
                                                    <th className="text-right py-2">Prix TTC</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[#1F2937]">
                                                {order.items.map((item, index) => {
                                                    const isDiscount = parseFloat(item.product_price_ttc.replace(/[^\d.-]/g, '')) < 0;
                                                    const isAvoir = parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, '')) < 0;
                                                    
                                                    return (
                                                        <tr key={index} className={`text-sm ${isDiscount ? 'bg-[#111827]' : ''}`}>
                                                            <td className={`py-2 ${isAvoir ? 'text-[#f59e0b]' : isDiscount ? 'text-[#60A5FA]' : 'text-gray-400'}`}>
                                                                {item.product_ref || '-'}
                                                            </td>
                                                            <td className={`py-2 ${isAvoir ? 'text-[#f59e0b]' : isDiscount ? 'text-[#60A5FA]' : 'text-gray-300'}`}>
                                                                {item.product_ref ? (
                                                                    item.product_label
                                                                ) : (
                                                                    <span className={`italic ${isAvoir ? 'text-[#f59e0b]' : isDiscount ? 'text-[#60A5FA]' : 'text-gray-300'}`}>
                                                                        {item.invoice_description || item.product_label}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className={`py-2 text-right ${isAvoir ? 'text-[#f59e0b]' : isDiscount ? 'text-[#60A5FA]' : 'text-gray-300'}`}>
                                                                {item.qty_sold}
                                                            </td>
                                                            <td className={`py-2 text-right ${isAvoir ? 'text-[#f59e0b]' : isDiscount ? 'text-[#60A5FA]' : 'text-gray-300'}`}>
                                                                {item.product_price_ttc} DH
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                        
                                        {/* Payment Details and Notes */}
                                        <div className="mt-4 pt-4 border-t border-[#1F2937] space-y-3">
                                            {order.payment_details && (
                                                <div className="text-sm">
                                                    <span className="text-gray-400">Paiements:</span>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {order.payment_details.split(', ').map((payment, idx) => {
                                                            const [method, amount, date] = payment.split(': ');
                                                            if (!method || !amount) return null;
                                                            
                                                            const paymentInfo = PAYMENT_ICONS[method] || { icon: FaMoneyBillWave, color: '#60A5FA' };
                                                            const PaymentIcon = paymentInfo.icon;
                                                            
                                                            return (
                                                                <div 
                                                                    key={idx}
                                                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full border transition-shadow"
                                                                    style={{
                                                                        borderColor: paymentInfo.color,
                                                                        backgroundColor: `${paymentInfo.color}10`,
                                                                        boxShadow: `0 0 10px ${paymentInfo.color}30`
                                                                    }}
                                                                >
                                                                    <PaymentIcon 
                                                                        className="w-4 h-4"
                                                                        style={{ color: paymentInfo.color }}
                                                                    />
                                                                    <span style={{ color: paymentInfo.color }}>
                                                                        {method}
                                                                    </span>
                                                                    {amount && (
                                                                        <span style={{ color: paymentInfo.color }}>
                                                                            {amount}
                                                                        </span>
                                                                    )}
                                                                    {date && (
                                                                        <span className="text-xs text-gray-400">
                                                                            ({date})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}
                                            {parseFloat(order.amount_unpaid.replace(/[^\d.-]/g, '')) > 0 && 
                                             parseFloat(order.total_invoice_amount.replace(/[^\d.-]/g, '')) > 0 && (
                                                <div className="text-sm flex items-center gap-2">
                                                    <div 
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#ef4444] bg-[#ef4444]/10 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                                                    >
                                                        <span className="text-[#ef4444]">Reliquat:</span>
                                                        <span className="text-[#ef4444]">-{order.amount_unpaid} DH</span>
                                                    </div>
                                                </div>
                                            )}
                                            {order.private_note && (
                                                <div className="text-sm">
                                                    <span className="text-gray-400">Notes:</span>
                                                    <p className="text-gray-300 mt-1">{order.private_note}</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer */}
                                        <div className="mt-4 pt-4 border-t border-[#1F2937] flex justify-between items-center">
                                            <div className="text-sm text-gray-400 flex items-center gap-4">
                                                <div>
                                                    Commercial: <span className="text-gray-300">{order.commercial_name}</span>
                                                </div>
                                                <div>
                                                    ICE: <span className="text-gray-300">{order.client_ice || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <a 
                                                href={order.pdf_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-500 hover:text-blue-400"
                                            >
                                                <i className="icon-file-pdf-regular text-lg" />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default OrdersList;