import { DOLIBARR_CONFIG } from '@config/dolibarr';

export const dolibarrApi = {
    async getInvoicePdf(invoiceRef, entityId) {
        try {
            // Get invoice ID
            const invoiceResponse = await fetch(
                `${DOLIBARR_CONFIG.API_URL}/invoices?sqlfilters=(ref:=:'${invoiceRef}')`,
                {
                    headers: {
                        'DOLAPIKEY': DOLIBARR_CONFIG.API_KEY,
                        'Accept': 'application/json',
                        'Entity': entityId
                    }
                }
            );

            const invoices = await invoiceResponse.json();
            if (!invoices?.length) throw new Error('Invoice not found');

            // Get PDF
            const pdfResponse = await fetch(
                `${DOLIBARR_CONFIG.API_URL}/invoices/${invoices[0].id}/document`,
                {
                    headers: {
                        'DOLAPIKEY': DOLIBARR_CONFIG.API_KEY,
                        'Accept': 'application/pdf',
                        'Entity': entityId
                    }
                }
            );

            if (!pdfResponse.ok) throw new Error('Failed to fetch PDF');
            
            const blob = await pdfResponse.blob();
            return window.URL.createObjectURL(blob);

        } catch (error) {
            console.error('Dolibarr API Error:', error);
            throw error;
        }
    }
}; 