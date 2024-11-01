// components
import TopSellingProductItem from '@components/TopSellingProductItem';

// utils
import {addZero} from '@utils/helpers';
import PropTypes from 'prop-types';

const OrderTableItem = ({product, isLast}) => {
    return (
        <div className={`p-5 xs:px-6 ${!isLast ? 'border-b' : ''}`}
             key={product.id}>
            <TopSellingProductItem product={product} imgSize={40}/>
            <ul className="flex flex-col gap-1.5 mt-4">
                <li className="flex items-center justify-between">
                    <span className="text-label uppercase text-xs font-medium">
                          Price:
                    </span>
                    <span className="font-semibold text-header text-[15px]">
                          ${product.price}
                    </span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="text-label uppercase text-xs font-medium">
                          Quantity:
                    </span>
                    <span className="font-semibold text-header text-[15px]">
                          {addZero(product.qty)}
                    </span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="text-label uppercase text-xs font-medium">
                          Total:
                    </span>
                    <span className="font-semibold text-header text-[15px]">
                          ${(product.price * product.qty).toFixed(2)}
                    </span>
                </li>
            </ul>
        </div>
    )
}

OrderTableItem.propTypes = {
    product: PropTypes.object.isRequired,
    isLast: PropTypes.bool
}

export default OrderTableItem