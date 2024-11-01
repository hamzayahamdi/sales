// components
import AppBar from '@components/AppBar';
import SaleScheduler from '@widgets/SaleScheduler';
import StatisticsCard from '@components/StatisticsCard';
import SaleCalendar from '@widgets/SaleCalendar';
import SalesBanner from '@widgets/SalesBanner';

// hooks
import {useState} from 'react';
import {useWindowSize} from 'react-use';

const placeholder = {
    title: 'Today Revenue',
    iconClass: 'wallet-solid',
    value: 2189,
    valuePrefix: '$',
    trend: 12,
    data: [
        {value: 3500},
        {value: 2598},
        {value: 1500},
        {value: 5980},
        {value: 3400},
        {value: 2900},
        {value: 7100},
        {value: 6500},
        {value: 7500},
        {value: 5120},
    ]
}

const Sales = () => {
    const {width} = useWindowSize();
    const [activeDate, setActiveDate] = useState(new Date());

    return (
        <>
            <AppBar title="Sales" />
            <div className="layout-wrapper grid grid-cols-1 gap-6 md:gap-8 md:grid-cols-1 xl:grid-cols-[minmax(0,_1fr)_minmax(0,_358px)]">
                {
                    width < 1280 &&
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <SaleCalendar activeDate={activeDate}
                                      setActiveDate={setActiveDate} />
                        {width >= 768 && <SalesBanner />}
                    </div>
                }
                <SaleScheduler activeDate={activeDate}
                               setActiveDate={setActiveDate} />
                {
                    width >= 1280 &&
                    <div className="flex flex-col gap-6 md:gap-8">
                        <StatisticsCard data={placeholder}/>
                        <SaleCalendar activeDate={activeDate}
                                      setActiveDate={setActiveDate} />
                        <SalesBanner />
                    </div>
                }
            </div>
        </>
    )
}

export default Sales