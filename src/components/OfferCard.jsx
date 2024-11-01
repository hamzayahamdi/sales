// components
import Spring from '@components/Spring';
import {NavLink} from 'react-router-dom';

const OfferCard = ({ product, index }) => {
    return (
        <Spring className="group w-[240px] h-[297px] shrink-0 card-container card-container--light rounded-2xl overflow-hidden"
                type="slideLeft"
                index={index}>
            <div className="h-[193px] bg-[#ccc] relative overflow-hidden">
                {
                    product.discount &&
                    <span className="absolute badge-sale top-4 right-4 z-10">
                        -{product.discount}%
                    </span>
                }
                <img className="h-full will-change-transform transition-transform ease-in-out duration-500
                     group-hover:scale-110"
                     src={product.img}
                     alt={product.name}/>
            </div>
            <div className="flex flex-col items-start px-4 pt-2.5 pb-5">
                <NavLink className="font-semibold text-[15px] text-header max-w-[208px] truncate" to="/product">
                    {product.name}
                </NavLink>
                <span className="font-medium text-xs text-label uppercase mt-2 mb-2.5 max-w-[208px] truncate">
                    Category: {product.category}
                </span>
                <span className="font-bold text-[18px] text-header">
                    ${product.price}
                </span>
            </div>
        </Spring>
    )
}

export default OfferCard