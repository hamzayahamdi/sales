// components
import Spring from '@components/Spring';

// utils
import {numFormatter} from '@utils/helpers';

const placeholder = {
    earnings: 0,
    orders: 0,
    customers: 0
}

const StatsOverview = ({title, data = placeholder}) => {
    return (
        <Spring className="card p-5 h-full xs:p-6">
            <h2 className="mb-3 md:mb-2">{title}</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="bg-turquoise stats-badge">
                    <span className="counter">
                        {numFormatter(data.earnings, 1, '$')}
                    </span>
                    <span className="uppercase font-semibold text-header dark:text-white xs:mt-[1px]">
                        Earnings
                    </span>
                </div>
                <div className="bg-blue stats-badge">
                    <span className="counter">
                        {numFormatter(data.orders, 1)}
                    </span>
                    <span className="uppercase font-semibold text-header dark:text-white xs:mt-[1px]">
                        Orders
                    </span>
                </div>
                <div className="bg-peach stats-badge">
                    <span className="counter">
                        {numFormatter(data.customers, 1)}
                    </span>
                    <span className="uppercase font-semibold text-header dark:text-white xs:mt-[1px]">
                        Customers
                    </span>
                </div>
            </div>
        </Spring>
    )
}

export default StatsOverview