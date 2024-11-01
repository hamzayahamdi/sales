import AppBar from '@components/AppBar';
import OrderStatuses from '@widgets/OrderStatuses';
import FailedOrders from '@widgets/FailedOrders';
import OrdersTable from '@widgets/OrdersTable';

const Orders = () => {
    return (
        <>
            <AppBar title="Orders" />
            <div className="layout-wrapper flex flex-col flex-1 gap-6 md:gap-8">
                <div className="grid grid-cols-1 gap-6 md:gap-8 3xl:grid-cols-2">
                    <OrderStatuses/>
                    <FailedOrders/>
                </div>
                <OrdersTable/>
            </div>
        </>
    )
}

export default Orders