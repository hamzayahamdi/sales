// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import BasicTable from '@components/BasicTable';
import Empty from '@components/Empty';
import StatusBadge from '@ui/StatusBadge';
import ScrollContainer from '@components/ScrollContainer';

// hooks
import {useState} from 'react';
import {useWindowSize} from 'react-use';
import useMeasure from 'react-use-measure';

// constants
import {ORDER_STATUS_COLUMN_DEFS} from '@constants/columnDefs';

// utils
import {faker} from '@faker-js/faker';
import dayjs from 'dayjs';

const options = [
    {value: 'recent', label: 'Recent'},
    {value: 'oldest', label: 'Oldest'}
]

const data = [
    {id: '34L912', date: faker.date.recent(), status: 'new'},
    {id: '34FG44', date: faker.date.recent(), status: 'completed'},
    {id: '25GGK1', date: faker.date.past(), status: 'processing'},
    {id: 'LP4755', date: faker.date.past(), status: 'cancelled'},
    {id: '00BK45', date: faker.date.past(), status: 'completed'},
    {id: '34L602', date: faker.date.recent(), status: 'new'},
    {id: '56TG44', date: faker.date.recent(), status: 'completed'},
    {id: '266GK1', date: faker.date.past(), status: 'processing'},
    {id: 'LP1855', date: faker.date.past(), status: 'cancelled'}
]

const OrderStatusCard = ({order, index}) => {
    return (
        <Spring className="card-container card-container p-5 rounded-2xl" type="slideUp" index={index}>
            <span className="text-sidebar font-semibold dark:text-turquoise">
                #{order.id}
            </span>
            <div className="flex items-center gap-2 mt-2 mb-4">
                <span className="text-[15px] font-semibold text-header">
                    Date:
                </span>
                {dayjs(order.date).format('MMM DD, YYYY')}
            </div>
            <StatusBadge status={order.status}/>
        </Spring>
    )
}

const OrderStatusTableMini = () => {
    const {width} = useWindowSize();
    const [headerRef, {height}] = useMeasure();
    const [sort, setSort] = useState(options[0]);

    const sortedData = data.sort((a, b) => {
        if (sort.value === 'recent') {
            return dayjs(b.date).diff(a.date)
        } else {
            return dayjs(a.date).diff(b.date)
        }
    })

    return (
        <Spring className="card flex flex-col h-[392px] overflow-hidden md:h-full md:gap-4 md:p-6">
            <div className="flex flex-col gap-2.5 xs:flex-row xs:items-center justify-between !pb-4 p-5 xs:p-6 md:!p-0" ref={headerRef}>
                <h2>Order Status</h2>
                <div className="min-w-[110px]">
                    <Select value={sort} onChange={setSort} options={options}/>
                </div>
            </div>
            {
                width < 768 ?
                    <ScrollContainer heightDeps={height}>
                        <div className="track flex flex-col gap-4 p-5 !pt-0 xs:p-6">
                            {
                                sortedData.map((order, index) => (
                                    <OrderStatusCard order={order}
                                                     index={index}
                                                     key={`${order.id}-${index}`}/>
                                ))
                            }
                        </div>
                    </ScrollContainer>
                    :
                    <BasicTable columns={ORDER_STATUS_COLUMN_DEFS}
                                dataSource={sortedData}
                                pagination={false}
                                scroll={{ y: width >= 1280 && width < 1440 ? 454 : 242 }}
                                rowKey="id"
                                showSorterTooltip={false}
                                locale={{
                                    emptyText: <Empty text="No orders found"/>
                                }}/>
            }
        </Spring>
    )
}

export default OrderStatusTableMini