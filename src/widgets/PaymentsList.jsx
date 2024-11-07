import { useState, useEffect, useMemo, useCallback } from 'react';
import { useWindowSize } from 'react-use';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport } from 'react-icons/fa';
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

    const fetchPayments = async () => {
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
            
            if (data.payments) {
                setPayments(data.payments);
                setDisplayedPayments(data.payments);
            }
        } catch (error) {
            console.error('Failed to fetch payments:', error);
            setPayments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [storeId, dateRange]);

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
            <div className="flex flex-col h-[700px] p-5 xs:p-6 bg-white shadow-lg rounded-xl">
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
        <div className="flex flex-col h-[700px] p-4 xs:p-5 bg-white shadow-lg rounded-xl">
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="space-y-2">
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
            </div>
        </div>
    );
};

export default PaymentsList; 