import AppBar from '@components/AppBar';
import AppGrid from '@components/AppGrid';
import StatsOverview from '@widgets/StatsOverview';
import ProfitBars from '@widgets/ProfitBars';
import AudienceOverview from '@widgets/AudienceOverview';
import FeedbackPie from '@widgets/FeedbackPie';
import VisitsBySource from '@widgets/VisitsBySource';
import TotalTransactionsBars from '@widgets/TotalTransactionsBars';

const data = {
    a: {
        earnings: 450,
        orders: 40,
        customers: 70
    },
    b: {
        earnings: 8200,
        orders: 99200,
        customers: 1300000
    }
}

const widgets = {
    stats_overview_a: <StatsOverview title="Today Overview" data={data.a}/>,
    stats_overview_b: <StatsOverview title="Total Overview" data={data.b}/>,
    profit: <ProfitBars />,
    audience: <AudienceOverview />,
    feedback: <FeedbackPie />,
    visits: <VisitsBySource />,
    transactions: <TotalTransactionsBars />,
}

const DashboardC = () => {
    return (
        <>
            <AppBar title="Dashboard"/>
            <AppGrid id="dashboard_c" widgets={widgets} />
        </>
    )
}

export default DashboardC