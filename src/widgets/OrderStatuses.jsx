// components
import Spring from '@components/Spring';
import StatisticsNumber from '@components/StatisticsNumber';
import {Fragment} from 'react';

const data = [
    {
        icon: 'square-list',
        value: 2000,
        label: 'All'
    },
    {
        icon: 'loader',
        value: 70,
        label: 'Pending'
    },
    {
        icon: 'box-check',
        value: 120,
        label: 'Completed'
    },
    {
        icon: 'bars-progress',
        value: 60,
        label: 'Progress'
    }
]

const OrderStatuses = () => {
    return (
        <Spring className="bg-turquoise md:h-[180px] rounded-[20px] p-5 xs:p-6">
            <p className="text-white text-[15px] font-semibold uppercase mb-2.5">
                Order Statuses
            </p>
            <div className="grid grid-cols-1 gap-4 bg-widget rounded-2xl md:grid-cols-4 md:h-[100px] md:py-4
                 md:items-center md:gap-0">
                {
                    data.map((item, index) => (
                        <Fragment key={item.label}>
                            <StatisticsNumber index={index} data={data} item={item} />
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

export default OrderStatuses