import AppBar from '@components/AppBar';
import AppGrid from '@components/AppGrid';
import SalesByCategoryRadialBar from '@widgets/SalesByCategoryRadialBar';
import NewsTimeline from '@widgets/NewsTimeline';
import TopSellingList from '@widgets/TopSellingList';
import OrdersList from '@widgets/OrdersList';
import LatestOffer from '@widgets/LatestOffer';

const widgets = {
    sales_analytics: <SalesByCategoryRadialBar/>,
    news_timeline: <NewsTimeline/>,
    top_selling: <TopSellingList/>,
    orders: <OrdersList/>,
    latest_offer: <LatestOffer/>,
}

const DashboardD = () => {
    return (
        <>
            <AppBar title="Dashboard"/>
            <AppGrid id="dashboard_d" widgets={widgets}/>
        </>
    )
}

export default DashboardD