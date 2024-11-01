import AppBar from '@components/AppBar';
import AppGrid from '@components/AppGrid';
import StatisticsCard from '@components/StatisticsCard';
import PeriodBestSellers from '@widgets/PeriodBestSellers';
import SalesAnalyticsBar from '@widgets/SalesAnalyticsBar';
import SalesProgress from '@widgets/SalesProgress';
import ProductReviews from '@widgets/ProductReviews';
import OrderStatusTableMini from '@widgets/OrderStatusTableMini';
import VisitsHeatmapChart from '@widgets/VisitsHeatmapChart';

const placeholder = [
    {
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
    },
    {
        title: 'Today Visitors',
        iconClass: 'user-plus-solid',
        value: 512,
        valuePrefix: '',
        trend: 4,
        data: [
            {value: 512},
            {value: 113},
            {value: 280},
            {value: 689},
            {value: 235},
            {value: 580},
            {value: 313},
            {value: 290},
            {value: 570},
            {value: 620},
        ]
    },
]

const widgets = {
    stats: <div className="grid grid-cols-1 h-full gap-6 md:grid-cols-2 xl:gap-8">
        <StatisticsCard data={placeholder[0]}
                        chartClass="lg:w-[200px] xl:w-[360px] 3xl:hidden 4xl:block 4xl:w-[130px]"/>
        <StatisticsCard data={placeholder[1]}
                        chartClass="lg:w-[200px] xl:w-[360px] 3xl:hidden 4xl:block 4xl:w-[130px]"/>
    </div>,
    best_sellers: <PeriodBestSellers />,
    sales_analytics: <SalesAnalyticsBar />,
    progress: <SalesProgress />,
    reviews: <ProductReviews />,
    orders: <OrderStatusTableMini />,
    visits: <VisitsHeatmapChart />
}

const DashboardB = () => {
    return (
        <>
            <AppBar title="Dashboard"/>
            <AppGrid id="dashboard_b" widgets={widgets} />
        </>
    )
}

export default DashboardB