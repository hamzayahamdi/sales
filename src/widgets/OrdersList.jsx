// components
import Spring from '@components/Spring';
import BasicTable from '@components/BasicTable';
import Empty from '@components/Empty';
import OrderCollapse from '@components/OrderCollapse';
import Pagination from '@ui/Pagination';

// hooks
import {useWindowSize} from 'react-use';
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';

// constants
import {ORDERS_WIDGET_COLUMN_DEFS} from '@constants/columnDefs';

// data placeholder
import orders_table from '@db/orders_table';

const OrdersList = () => {
    const {width} = useWindowSize();
    const [activeCollapse, setActiveCollapse] = useState('');

    useEffect(() => {
        window.addEventListener('resize', () => {
            setActiveCollapse('');
        });

        return () => {
            window.removeEventListener('resize', () => {
                setActiveCollapse('');
            });
        }
    }, []);

    const data = orders_table.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const pagination = usePagination(data, 5);

    useEffect(() => {
        setActiveCollapse('');
    }, [pagination.currentPage]);

    return (
        <Spring className="card flex flex-col md:h-full">
            <h2 className="p-5 !pb-4 xs:p-6">
                Order List
            </h2>
            <div className="flex-1 p-5 !pt-0 xs:p-6">
                {
                    width < 768 ?
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-4">
                                {
                                    pagination.currentItems().map((order, index) => (
                                        <OrderCollapse key={index}
                                                       order={order}
                                                       active={activeCollapse}
                                                       setActive={setActiveCollapse}
                                                       index={index}/>
                                    ))
                                }
                            </div>
                            {pagination.maxPage > 1 && <Pagination pagination={pagination} btnClass="dark:bg-body"/>}
                        </div>
                        :
                        <BasicTable columns={ORDERS_WIDGET_COLUMN_DEFS}
                                    dataSource={data}
                                    rowKey="id"
                                    pagination={false}
                                    scroll={{y: 450}}
                                    showSorterTooltip={false}
                                    locale={{
                                        emptyText: <Empty text="No orders found"/>
                                    }}/>
                }
            </div>
        </Spring>
    )
}

export default OrdersList