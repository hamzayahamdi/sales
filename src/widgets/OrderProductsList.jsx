// components
import Spring from '@components/Spring';
import {NavLink} from 'react-router-dom';
import SimpleTable from '@components/SimpleTable';
import Empty from '@components/Empty';
import ScrollContainer from '@components/ScrollContainer';
import OrderTableItem from '@components/OrderTableItem';

// hooks
import useMeasure from 'react-use-measure';
import {useWindowSize} from 'react-use';

// constants
import {ORDER_COLUMN_DEFS} from '@constants/columnDefs';

// data placeholder
import order from '@db/order';

const OrderProductsList = () => {
    const {width} = useWindowSize();
    const [headerRef, {height: headerHeight}] = useMeasure();
    const [cardRef, {height: cardHeight}] = useMeasure();

    return (
        <Spring className="card h-[604px] md:h-full">
            <div className="flex flex-col h-full" ref={cardRef}>
                <div className="flex flex-col justify-between gap-4 p-6 pb-4 border-b sm:flex-row sm:items-center"
                     ref={headerRef}>
                    <h2>Order #M11986</h2>
                    <NavLink className="btn btn--primary" to="/invoice">
                        Invoice
                    </NavLink>
                </div>
                {
                    width < 768 ?
                        <ScrollContainer heightDeps={headerHeight}>
                            <div className="track">
                                {
                                    order.map((item, index) => (
                                        <OrderTableItem product={item} isLast={index !== order.length - 1} key={item.id}/>
                                    ))
                                }
                            </div>
                        </ScrollContainer>
                        :
                        <SimpleTable columns={ORDER_COLUMN_DEFS}
                                     dataSource={order}
                                     pagination={false}
                                     scroll={{y: cardHeight - headerHeight - 54}}
                                     showSorterTooltip={false}
                                     rowKey="id"
                                     locale={{
                                         emptyText: <Empty text="No products in this order yet."/>
                                     }}
                        />
                }
            </div>
        </Spring>
    )
}

export default OrderProductsList