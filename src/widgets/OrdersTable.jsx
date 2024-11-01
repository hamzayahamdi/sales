// components
import Spring from '@components/Spring';
import FilterItem from '@ui/FilterItem';
import FiltersButton from '@ui/FiltersButton';
import Search from '@ui/Search';
import BasicTable from '@components/BasicTable';
import Pagination from '@ui/Pagination';
import OrderCollapse from '@components/OrderCollapse';

// hooks
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';
import {useWindowSize} from 'react-use';

// constants
import {ORDER_STATUSES} from '@constants/options';
import {ORDERS_COLUMN_DEFS} from '@constants/columnDefs';

// data placeholder
import orders_table from '@db/orders_table';

const OrdersTable = () => {
    const {width} = useWindowSize();
    const [activeFilter, setActiveFilter] = useState('all');
    const [query, setQuery] = useState('');
    const [activeCollapse, setActiveCollapse] = useState('');

    const getQty = (status) => {
        if (status === 'all') return orders_table.length;
        return orders_table.filter(item => item.status === status).length;
    }

    const filteredOrders = () => {
        const data = activeFilter === 'all' ? orders_table : orders_table.filter(item => item.status === activeFilter);
        return data.filter(item => item.id.toLowerCase().includes(query.toLowerCase()));
    }

    const pagination = usePagination(filteredOrders(), 10);

    useEffect(() => {
        pagination.setCurrentPage(0)
    }, [activeFilter, query]);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setActiveCollapse('');
        });

        return () => {
            window.removeEventListener('resize', () => {
                setActiveCollapse('');
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setActiveCollapse('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage]);

    return (
        <Spring className="card flex flex-col flex-1">
            <div className="flex flex-col gap-5 p-5 !pb-4 border-b xs:p-6">
                <div className="flex flex-col gap-4 md:flex-row">
                    <Search wrapperClass="flex-1"
                            value={query}
                            onChange={setQuery}
                            placeholder="Search for Order..."/>
                    <button className="btn btn--base h-[50px] px-5 gap-2">
                        <i className="icon-arrow-down-to-line-regular text-[16px]"/>
                        Export
                    </button>
                    <button className="btn btn--primary">
                        Create Order
                    </button>
                </div>
                <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-x-6 gap-y-4">
                        {
                            ORDER_STATUSES.map((item, index) => (
                                <FilterItem key={index}
                                            {...item}
                                            qty={getQty(item.value)}
                                            active={activeFilter}
                                            setActive={setActiveFilter}/>
                            ))
                        }
                    </div>
                    <FiltersButton/>
                </div>
            </div>
            <div className="flex flex-col flex-1 gap-6 py-4 px-5 xs:px-6">
                {
                    width < 768 ?
                        <div className="flex flex-col gap-5">
                            <div className="flex flex-col gap-4">
                                {
                                    pagination.currentItems().map((item, index) => (
                                        <OrderCollapse key={item.id}
                                                       index={index}
                                                       active={activeCollapse}
                                                       setActive={setActiveCollapse}
                                                       order={item}/>
                                    ))
                                }
                            </div>
                            {pagination.maxPage > 1 && <Pagination pagination={pagination}/>}
                        </div>
                        :
                        <BasicTable columns={ORDERS_COLUMN_DEFS}
                                    dataSource={pagination.currentItems()}
                                    rowKey="id"
                                    rowSelection={{
                                        type: 'checkbox',
                                    }}
                                    showSorterTooltip={false}
                                    pagination={false}
                                    footer={() => (
                                        <div className="flex items-center justify-between">
                                            <p className="uppercase">
                                                {pagination.showingOf()}
                                            </p>
                                            <Pagination pagination={pagination} btnClass="dark:bg-widget"/>
                                        </div>
                                    )}/>
                }
            </div>
        </Spring>
    )
}

export default OrdersTable