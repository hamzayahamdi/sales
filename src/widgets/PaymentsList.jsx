import { useState, useEffect, useMemo } from 'react';
import { useWindowSize } from 'react-use';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaMoneyCheck, FaSearch, FaFileExport } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const STORE_COLORS = {
    'Casablanca': { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', shadow: 'rgba(34,197,94,0.3)' },
    'Rabat': { color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', shadow: 'rgba(59,130,246,0.3)' },
    'Marrakech': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', shadow: 'rgba(245,158,11,0.3)' },
    'Tanger': { color: '#ec4899', bg: 'rgba(236,72,153,0.1)', shadow: 'rgba(236,72,153,0.3)' },
    'Outlet': { color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', shadow: 'rgba(139,92,246,0.3)' }
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

    const getStoreLabel = (invoiceRef) => {
        const storeName = getStoreFromInvoiceRef(invoiceRef);
        if (!storeName) return null;

        const store = STORE_COLORS[storeName];
        if (!store) return null;

        return (
            <span 
                className="px-2 py-0.5 text-xs font-medium rounded-full border transition-shadow"
                style={{
                    color: store.color,
                    borderColor: store.color,
                    backgroundColor: store.bg,
                    boxShadow: `0 0 10px ${store.shadow}`,
                }}
            >
                {storeName}
            </span>
        );
    };

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

    const filteredPayments = useMemo(() => {
        if (!searchTerm) return payments;
        
        return payments.filter(payment => 
            payment.payment_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.invoice_ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [payments, searchTerm]);

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
            <div className="flex flex-col h-[700px] p-5 xs:p-6 bg-[#1F2937] shadow-lg rounded-xl">
                <h2 className="text-xl font-semibold mb-4 text-gray-300">Liste des paiements</h2>
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
                    <FaMoneyBillWave className="text-lg text-blue-400" />
                    Liste des paiements
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
                    {filteredPayments.map((payment, index) => {
                        const PaymentIcon = PAYMENT_ICONS[payment.payment_method] || FaMoneyBillWave;
                        
                        return (
                            <div key={index} className="bg-[#111827] hover:bg-black hover:bg-opacity-50 transition-colors duration-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-gray-300">{payment.payment_ref}</span>
                                            <PaymentIcon 
                                                className="w-5 h-5 text-[#599AED] drop-shadow-[0_0_2px_#599AED]"
                                                style={{
                                                    filter: 'drop-shadow(0 0 2px #599AED)'
                                                }}
                                            />
                                            {storeId === 'all' && getStoreLabel(payment.invoice_ref)}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500">{payment.payment_date}</span>
                                            <span className="text-xs text-gray-400">{payment.payment_method}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="font-medium text-gray-300">{payment.amount} DH</span>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-400">
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