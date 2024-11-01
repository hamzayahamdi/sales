// components
import Spring from '@components/Spring';
import Search from '@ui/Search';
import SubmenuButton from '@ui/SubmenuButton';
import FilterItem from '@ui/FilterItem';
import FiltersButton from '@ui/FiltersButton';
import BasicTable from '@components/BasicTable';
import Pagination from '@ui/Pagination';
import Empty from '@components/Empty';
import ReviewCollapse from '@components/ReviewCollapse';

// hooks
import {useState, useEffect} from 'react';
import {useWindowSize} from 'react-use';
import usePagination from '@hooks/usePagination';

// constants
import {REVIEW_FILTERS} from '@constants/options';
import {REVIEW_COLUMN_DEFS} from '@constants/columnDefs';

// utils
import dayjs from 'dayjs';

// data placeholder
import reviews_table from '@db/reviews_table';

const ReviewsTable = () => {
    const {width} = useWindowSize();
    const [activeFilter, setActiveFilter] = useState('all');
    const [query, setQuery] = useState('');
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

    const getQty = (value) => {
        if (value === 'all') return reviews_table.length;
        return reviews_table.filter(review => review.status === value).length;
    }

    const sortedReviews = reviews_table.sort((a, b) => {
        const dateA = dayjs(a.date);
        const dateB = dayjs(b.date);
        return dateB - dateA;
    }).filter(review => {
        if (activeFilter === 'all') return review;
        return review.status === activeFilter;
    }).filter(review => {
        if (query === '') return review;
        return review.product.name.toLowerCase().includes(query.toLowerCase());
    })

    const pagination = usePagination(sortedReviews, 10);

    return (
        <div className="layout-wrapper">
            <Spring className="card flex flex-col flex-1 w-full h-full">
                <div className="flex flex-col gap-5 p-5 !pb-4 border-b xs:p-6">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <Search value={query}
                                onChange={setQuery}
                                wrapperClass="flex-1"
                                placeholder="Search for Product..."/>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:flex">
                            <SubmenuButton/>
                            <button className="btn btn--primary">
                                Add Review
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-x-6 gap-y-4">
                            {
                                REVIEW_FILTERS.map((filter, index) => (
                                    <FilterItem key={index}
                                                {...filter}
                                                qty={getQty(filter.value)}
                                                active={activeFilter}
                                                setActive={setActiveFilter}/>
                                ))
                            }
                        </div>
                        <FiltersButton/>
                    </div>
                </div>
                <div className="flex-1 px-5 pt-4 pb-5 xs:px-6 xs:pb-6 md:pb-2.5">
                    {
                        width < 768 ?
                            <div className="flex flex-col gap-5">
                                <div className="flex flex-col gap-4">
                                    {
                                        pagination.currentItems().map((review, index) => (

                                            <ReviewCollapse key={index}
                                                            review={review}
                                                            active={activeCollapse}
                                                            setActive={setActiveCollapse}
                                                            index={index}/>
                                        ))
                                    }
                                </div>
                                {pagination.maxPage > 1 && <Pagination pagination={pagination}/>}
                            </div>
                            :
                            <BasicTable columns={REVIEW_COLUMN_DEFS}
                                        dataSource={pagination.currentItems()}
                                        rowKey="id"
                                        rowSelection={{
                                            type: 'checkbox',
                                        }}
                                        pagination={false}
                                        locale={{
                                            emptyText: <Empty title="No Reviews Found"/>
                                        }}
                                        showSorterTooltip={false}
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
        </div>
    )
}

export default ReviewsTable