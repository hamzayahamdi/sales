// components
import AppBar from '@components/AppBar';
import AppGrid from '@components/AppGrid';
import InvoicePanel from '@components/InvoicePanel';
import InvoiceInfo from '@widgets/InvoiceInfo';
import InvoiceReceiver from '@widgets/InvoiceReceiver';
import ProfileCard from '@widgets/ProfileCard';
import InvoiceDetails from '@widgets/InvoiceDetails';
import PaymentMethod from '@widgets/PaymentMethod';
import SendInvoice from '@widgets/SendInvoice';

// hooks
import {useWindowSize} from 'react-use';

// assets
import user from '@assets/customer.webp';

const client = {
    firstName: 'Balveer',
    lastName: 'Bhadiar',
    avatar: user,
    role: 'customer',
    mobile: '+1-9846499950',
    email: 'dashboard@comvi.com',
    location1: '25 Melrose Court, Lafayette',
    location2: 'United States'
}

const widgets = {
    info: <InvoiceInfo/>,
    receiver: <InvoiceReceiver/>,
    client: <ProfileCard data={client}/>,
    details: <InvoiceDetails/>,
    method: <PaymentMethod/>,
    send: <SendInvoice/>
}

const Invoice = () => {
    const {width} = useWindowSize();

    const gridBreakpoints = {
        md: width >= 768 && width < 1024,
        lg: width >= 1024 && width < 1366,
        xl: width >= 1366
    }

    return (
        <>
            <AppBar title="Invoice" />
            <InvoicePanel />
            <AppGrid id="invoice" widgets={widgets} gridBreakpoints={gridBreakpoints} />
        </>
    )
}

export default Invoice