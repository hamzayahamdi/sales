// components
import {NavLink} from 'react-router-dom';

// utils
import PropTypes from 'prop-types';

const TopSellingProductItem = ({titleClass = '', subtitleClass = '', product}) => {
    return (
        <div className="flex flex-col gap-1">
            <h3 className={`font-medium text-gray-300 ${titleClass}`}>
                {product.name}
            </h3>
            <p className={`text-xs text-gray-400 ${subtitleClass}`}>
                Réf: {product.ref}
            </p>
        </div>
    )
}

TopSellingProductItem.propTypes = {
    product: PropTypes.object.isRequired,
    titleClass: PropTypes.string,
    subtitleClass: PropTypes.string
}

export default TopSellingProductItem