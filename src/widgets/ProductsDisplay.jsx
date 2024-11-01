// components
import Spring from '@components/Spring';
import Search from '@ui/Search';
import SubmenuButton from '@ui/SubmenuButton';
import IconButton from '@ui/IconButton';
import FilterItem from '@ui/FilterItem';
import ProductGridItem from '@components/ProductGridItem';
import BasicTable from '@components/BasicTable';
import Pagination from '@ui/Pagination';
import TopSellingCollapse from '@components/TopSellingCollapse';
import Empty from '@components/Empty';
import Tag from '@ui/Tag';

// hooks
import {useState, useEffect} from 'react';
import usePagination from '@hooks/usePagination';
import {useWindowSize} from 'react-use';
import useMeasure from 'react-use-measure';

// constants
import {PRODUCT_STATUSES} from '@constants/options';
import {TOP_SELLING_COLUMN_DEFS} from '@constants/columnDefs';

// utils
import PropTypes from 'prop-types';
import classNames from 'classnames';

// data placeholder
import products from '@db/products';

const ProductsDisplay = ({view, setView, open, handler}) => {
    const {width} = useWindowSize();
    const [ref, {height}] = useMeasure();
    const [query, setQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [activeCollapse, setActiveCollapse] = useState('');

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(query.toLowerCase())
    }).filter(product => {
        if (activeFilter === 'all') return product;
        return product.status === activeFilter;
    })

    const getQty = (value) => {
        if (value === 'all') return products.length;
        return products.filter(product => product.status === value).length;
    }

    const step = view === 'grid' ? (width < 1280 ? 10 : 12) : 10;

    const pagination = usePagination(filteredProducts, step);

    useEffect(() => {
        document.documentElement.style.setProperty('--products-display-height', `${height.toFixed(2)}px`);
    }, [height]);

    return (
        <Spring className={`card flex-1 h-full ${view === 'grid' && !open ? 'xl:col-span-2' : ''}`}>
            <div className="flex flex-col h-full" ref={ref}>
                <div className="flex flex-col gap-5 p-5 !pb-0 mb-4 xs:p-6">
                    <div className="flex flex-col gap-4 md:gap-6 lg:flex-row">
                        <Search value={query}
                                onChange={setQuery}
                                wrapperClass="flex-1"
                                placeholder="Search Product ..."/>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:flex">
                            <SubmenuButton/>
                            <button className="btn btn--base h-[50px] px-5 gap-2">
                                <i className="icon-arrow-down-to-line-regular"/>
                                Export Products
                            </button>
                            <button className="btn btn--primary sm:col-span-2 md:col-span-1">
                                Add Product
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="flex flex-wrap gap-4">
                            {
                                PRODUCT_STATUSES.map((item, index) => (
                                    <FilterItem key={index}
                                                {...item}
                                                qty={getQty(item.value)}
                                                active={activeFilter}
                                                setActive={setActiveFilter}/>
                                ))
                            }
                        </div>
                        <div className="flex gap-4 md:ml-auto">
                            <IconButton iconClass={classNames({
                                'text-turquoise icon-filters-solid': open,
                                'icon-filters-regular': !open
                            })}
                                        className={view === 'list' ? 'xl:hidden' : ''}
                                        onClick={() => handler(!open)}
                                        ariaLabel="Open filters"/>
                            <IconButton iconClass={classNames({
                                'text-turquoise icon-grid-2-solid': view === 'grid',
                                'icon-grid-2-regular': view !== 'grid'
                            })}
                                        onClick={() => setView('grid')}
                                        ariaLabel="Grid view"/>
                            <IconButton iconClass={classNames({
                                'text-turquoise icon-list-solid': view === 'list',
                                'icon-list-regular': view !== 'list'
                            })}
                                        onClick={() => setView('list')}
                                        ariaLabel="List view"/>
                        </div>
                    </div>
                </div>
                <div className="flex flex-1 flex-col justify-between gap-5 border-t p-5 xs:p-6">
                    {
                        view === 'grid' ?
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-wrap gap-y-2 gap-x-4">
                                    <Tag value="cotton" onClick={() => {}}/>
                                    <Tag value="shoes" onClick={() => {}}/>
                                    <Tag value="red" onClick={() => {}}/>
                                    <Tag value="Clear all" onClick={() => {}} role="reset"/>
                                </div>
                                {
                                    filteredProducts.length ?
                                        <div className={`grid grid-cols-1 gap-8 md:grid-cols-2 ${open ? '4xl:grid-cols-4' : 'xl:grid-cols-4'}`}>
                                            {
                                                pagination.currentItems().map((product, index) => (
                                                    <ProductGridItem key={index} product={product} index={index}/>
                                                ))
                                            }
                                        </div>
                                        :
                                        <Empty text="No Products Found"/>
                                }
                            </div>
                            :
                            width < 768 ?
                                filteredProducts.length ?
                                    <div className="flex flex-col gap-4">
                                        {
                                            pagination.currentItems().map((product, index) => (
                                                <TopSellingCollapse key={index}
                                                                    product={product}
                                                                    active={activeCollapse}
                                                                    setActive={setActiveCollapse}
                                                                    index={index}/>
                                            ))
                                        }
                                    </div>
                                    :
                                    <Empty text="No Products Found"/>
                                :
                                <BasicTable columns={TOP_SELLING_COLUMN_DEFS}
                                            dataSource={pagination.currentItems()}
                                            showSorterTooltip={false}
                                            rowKey="id"
                                            pagination={false}
                                            locale={{
                                                emptyText: <Empty text="No Products Found"/>
                                            }}
                                />
                    }
                    <div className="flex flex-col gap-5 justify-between md:flex-row md:items-center">
                        <p className="font-semibold text-sm text-label dark:text-header">
                            {pagination.showingOf()}
                        </p>
                        {pagination.maxPage > 1 && <Pagination pagination={pagination}/>}
                    </div>
                </div>
            </div>
        </Spring>
    )
}

ProductsDisplay.propTypes = {
    view: PropTypes.string.isRequired,
    setView: PropTypes.func.isRequired
}

export default ProductsDisplay

