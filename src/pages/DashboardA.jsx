import { useState } from 'react';
import dayjs from 'dayjs';

// Components
import AppBar from '@components/AppBar';
import Statistics from '@widgets/Statistics';
import SalesAnalyticsArea from '@widgets/SalesAnalyticsArea';
import SalesByCategory from '@widgets/SalesByCategory';
import TopSelling from '@widgets/TopSelling';
import SalesTeamLeaderboard from '@widgets/SalesTeamLeaderboard';

const DashboardA = () => {
    // Initialize with today's date
    const today = dayjs();
    const defaultDateRange = `${today.format('DD/MM/YYYY')} - ${today.format('DD/MM/YYYY')}`;
    
    // State
    const [dateRange, setDateRange] = useState(defaultDateRange);
    const [selectedStoreId, setSelectedStoreId] = useState('1');

    return (
        <div className="bg-[#111827] min-h-screen">
            <AppBar 
                title="Dashboard"
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                selectedStoreId={selectedStoreId}
                onStoreChange={setSelectedStoreId}
            />
            <div className="px-4 space-y-6 pt-[20px] pb-24 w-full max-w-full">
                <div className="w-full">
                    <Statistics 
                        dateRange={dateRange} 
                        storeId={selectedStoreId} 
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SalesAnalyticsArea storeId={selectedStoreId} />
                    <SalesByCategory 
                        storeId={selectedStoreId}
                        dateRange={dateRange}
                    />
                    <TopSelling 
                        storeId={selectedStoreId}
                        dateRange={dateRange}
                    />
                    <SalesTeamLeaderboard 
                        storeId={selectedStoreId}
                        dateRange={dateRange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardA;