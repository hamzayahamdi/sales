// components
import Spring from '@components/Spring';
import Collapse from '@mui/material/Collapse';
import TopSellingProductItem from '@components/TopSellingProductItem';

// utils
import PropTypes from 'prop-types';

const TopSellingCollapse = ({product, active, setActive, index, showStock}) => {
    const toggleCollapse = () => {
        if (active === product.id) {
            setActive('');
        } else {
            setActive(product.id);
        }
    }

    const getStockStatus = (stock) => {
        if (stock > 2) {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm px-4 py-1 rounded-full border border-[#22c55e] text-[#22c55e] bg-[#22c55e]/10">
                        In Stock
                    </span>
                    <span className="text-gray-300 text-sm">
                        ({stock} pcs)
                    </span>
                </div>
            );
        } else if (stock === 0) {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm px-4 py-1 rounded-full border border-[#ef4444] text-[#ef4444] bg-[#ef4444]/10">
                        Out of Stock
                    </span>
                </div>
            );
        } else {
            return (
                <div className="flex items-center gap-2">
                    <span className="font-medium text-sm px-4 py-1 rounded-full border border-[#f59e0b] text-[#f59e0b] bg-[#f59e0b]/10">
                        Low Stock
                    </span>
                    <span className="text-gray-300 text-sm">
                        ({stock} pcs)
                    </span>
                </div>
            );
        }
    };

    return (
        <div className="bg-[#111827] p-3 rounded-lg">
            <div className="flex items-center justify-between gap-3">
                <TopSellingProductItem
                    titleClass="truncate max-w-[140px] xxs:max-w-[180px] text-gray-300 text-sm"
                    subtitleClass="truncate max-w-[140px] xxs:max-w-[180px] text-gray-400 text-xs"
                    product={product}
                />
                <button className={`text-gray-300 hover:text-white transition-colors ${active === product.id ? 'rotate-180' : ''}`}
                        onClick={toggleCollapse}
                        aria-label="Toggle">
                    <i className="icon-chevron-down-regular text-sm"/>
                </button>
            </div>
            <Collapse in={active === product.id}>
                <ul className="flex flex-col gap-2 mt-3">
                    <li className="flex items-center justify-between pb-2 border-b border-[#374151]">
                        <span className="uppercase text-gray-400 text-[11px] font-medium">
                            Vendu :
                        </span>
                        <span className="text-gray-300 font-semibold text-sm">
                            {product.qty_sold} pcs
                        </span>
                    </li>
                    {showStock && (
                        <li className="flex items-center justify-between pb-2 border-b border-[#374151]">
                            <span className="uppercase text-gray-400 text-[11px] font-medium">
                                Stock :
                            </span>
                            <span className="text-gray-300 font-semibold text-sm">
                                {getStockStatus(product.stock)}
                            </span>
                        </li>
                    )}
                    <li className="flex items-center justify-between">
                        <span className="uppercase text-gray-400 text-[11px] font-medium">
                            Total :
                        </span>
                        <span className="text-gray-300 font-semibold text-sm">
                            {new Intl.NumberFormat('en-US').format(product.total)} DH
                        </span>
                    </li>
                </ul>
            </Collapse>
        </div>
    )
}

TopSellingCollapse.propTypes = {
    product: PropTypes.object.isRequired,
    active: PropTypes.string.isRequired,
    setActive: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    showStock: PropTypes.bool.isRequired
}

export default TopSellingCollapse