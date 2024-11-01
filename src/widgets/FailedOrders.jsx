// components
import Spring from '@components/Spring';
import StatisticsNumber from '@components/StatisticsNumber';
import {Fragment} from 'react';

const data = [
    {
        icon: 'cart-circle-xmark',
        value: 160,
        label: 'Abandoned'
    },
    {
        icon: 'arrow-right-arrow-left',
        value: 222,
        label: 'Returned'
    },
    {
        icon: 'ban',
        value: 78,
        label: 'Canceled'
    },
    {
        icon: 'square-fragile',
        value: 35,
        label: 'Damaged'
    }
]

const FailedOrders = () => {
    return (
        <Spring className="bg-blue md:h-[180px] rounded-[20px] p-5 xs:p-6">
            <p className="text-white text-[15px] font-semibold uppercase mb-2.5">
                Failed Orders
            </p>
            <div className="grid grid-cols-1 gap-4 bg-widget rounded-2xl md:grid-cols-4 md:h-[100px] md:py-4
                 md:items-center md:gap-0">
                {
                    data.map((item, index) => (
                        <Fragment key={item.label}>
                            <StatisticsNumber item={item} index={index} data={data} />
                            {
                                index !== data.length - 1 &&
                                <div className="h-[1px] bg-border md:hidden"/>
                            }
                        </Fragment>
                    ))
                }
            </div>
        </Spring>
    )
}

export default FailedOrders