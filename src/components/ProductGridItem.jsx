// components
import Spring from '@components/Spring';
import {NavLink} from 'react-router-dom';
import BasicCheckbox from '@ui/BasicCheckbox';
import StatusBadge from '@ui/StatusBadge';

// utils
import dayjs from 'dayjs';

const ProductGridItem = ({product, index}) => {
    return (
        <Spring className="card-container card-container--light rounded-2xl overflow-hidden"
                type="slideUp"
                index={index}>
            <div className="relative h-[280px]">
                <img className="h-full" src={product.img} alt={product.name}/>
                <div className="absolute w-full top-0 left-0 z-10 p-5 flex items-center justify-between">
                    <StatusBadge status={product.status} type="product"/>
                    <BasicCheckbox id={product.id}/>
                </div>
            </div>
            <div className="border-t p-5">
                <p className="text-xs uppercase text-label">
                    Category: {product.category}
                </p>
                <NavLink className="inline-block mt-1 mb-[14px] font-semibold text-[15px] text-header hover:text-sidebar
                         dark:hover:text-peach"
                         to="/product">
                    {product.name}
                </NavLink>
                <div className="flex items-center justify-between">
                    <span className="font-semibold">
                        {dayjs(product.lastModified).format('DD.MM.YYYY')}
                    </span>
                    <span className="text-[18px] font-bold text-header">
                        ${product.price}
                    </span>
                </div>
            </div>
        </Spring>
    )
}

export default ProductGridItem