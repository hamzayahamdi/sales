import AppBar from '@components/AppBar';
import AppGrid from '@components/AppGrid';
import OrderProductsList from '@widgets/OrderProductsList';
import OrderSummary from '@widgets/OrderSummary';
import OrderComment from '@widgets/OrderComment';
import OrderInfoCard from '@widgets/OrderInfoCard';
import SaleBanner from '@widgets/SaleBanner';
import TrackOrder from '@widgets/TrackOrder';

const shippingInfo = [
    {label: 'Full Name', value: 'Gabriel Pires'},
    {label: 'Address', value: '12 Tompkins Drive, Port Orange, FL 32127'},
    {label: 'Phone Number', value: '+1-9846499950'},
    {label: 'Email', value: 'dashboard@comvi.com'}
]

const paymentInfo = [
    {label: 'Transaction', value: '#AME123461272341'},
    {label: 'Payment Method', value: 'Debit Card'},
    {label: 'Card Holder Name', value: 'Gabriel Pires'},
    {label: 'Card Number', value: 'xxxx xxxx xxxx 1234'},
]

const widgets = {
    products: <OrderProductsList/>,
    summary: <OrderSummary/>,
    comment: <OrderComment/>,
    shipping: <OrderInfoCard title="Shipping Information" data={shippingInfo}/>,
    payment: <OrderInfoCard title="Payment Details" data={paymentInfo}/>,
    tracking: <TrackOrder/>,
    banner: <SaleBanner/>
}

const OrderDetails = () => {
    return (
        <>
            <AppBar title="Order Details" />
            <AppGrid id="order_details" widgets={widgets} />
        </>
    )
}

export default OrderDetails