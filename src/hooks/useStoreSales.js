import { useState, useEffect } from 'react';

const useStoreSales = (dateRange) => {
    const [storeSales, setStoreSales] = useState({
        '1': 0,  // Casablanca
        '2': 0,  // Rabat
        '6': 0,  // Marrakech
        '5': 0,  // Tanger
        '10': 0, // Outlet
        'all': 0 // Total
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);

                // Fetch data for each store individually
                const stores = [
                    { id: '1', formId: 'store_id' },
                    { id: '2', formId: 'store_id' },
                    { id: '6', formId: 'store_id' },
                    { id: '5', formId: 'store_id' },
                    { id: '10', formId: 'store_id' },
                    { id: 'all', formId: 'store_id' }
                ];

                const newStoreSales = { ...storeSales };

                // Fetch total (all stores) first
                const formDataAll = new FormData();
                formDataAll.append('date_range', dateRange);
                formDataAll.append('store_id', 'all');

                const responseAll = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_sales_new.php', {
                    method: 'POST',
                    body: formDataAll
                });

                const dataAll = await responseAll.json();
                newStoreSales['all'] = parseInt(dataAll.total_invoice_ttc.toString().replace(/[.,\s]/g, '') || '0', 10);

                // Fetch individual stores
                for (const store of stores.filter(s => s.id !== 'all')) {
                    const formData = new FormData();
                    formData.append('date_range', dateRange);
                    formData.append('store_id', store.id);

                    const response = await fetch('https://ratio.sketchdesign.ma/ratio/fetch_sales_new.php', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();
                    newStoreSales[store.id] = parseInt(data.total_invoice_ttc.toString().replace(/[.,\s]/g, '') || '0', 10);
                }

                console.log('Store Sales:', newStoreSales); // Debug log
                setStoreSales(newStoreSales);
            } catch (error) {
                console.error('Failed to fetch store sales:', error);
                setStoreSales({
                    '1': 0, '2': 0, '6': 0, '5': 0, '10': 0, 'all': 0
                });
            } finally {
                setLoading(false);
            }
        };

        if (dateRange) {
            fetchSales();
        }
    }, [dateRange]);

    return { storeSales, loading };
};

export default useStoreSales; 