import { useState } from 'react';
import dayjs from 'dayjs';

// Components
import AppBar from '@components/AppBar';
import Statistics from '@widgets/Statistics';
import SalesAnalyticsArea from '@widgets/SalesAnalyticsArea';
import SalesByCategory from '@widgets/SalesByCategory';
import TopSelling from '@widgets/TopSelling';
import SalesTeamLeaderboard from '@widgets/SalesTeamLeaderboard';
import SalesByStore from '@widgets/SalesByStore';
import OrdersList from '@widgets/OrdersList';
import PaymentsList from '@widgets/PaymentsList';
import StockIndex from '@widgets/StockIndex';

import useStoreSales from '@hooks/useStoreSales';

const DashboardA = () => {
    const today = dayjs();
    const defaultDateRange = `${today.format('DD/MM/YYYY')} - ${today.format('DD/MM/YYYY')}`;
    
    const [dateRange, setDateRange] = useState(defaultDateRange);
    const [selectedStoreId, setSelectedStoreId] = useState('1');
    const { storeSales, loading } = useStoreSales(dateRange);

    return (
        <div className="bg-[#F3F3F8] min-h-screen w-full">
            <div className="w-full">
                <AppBar 
                    title="Dashboard"
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    selectedStoreId={selectedStoreId}
                    onStoreChange={setSelectedStoreId}
                    storeSales={storeSales}
                    loading={loading}
                />
            </div>
            <div className="space-y-6 pt-[20px] pb-24">
                <div className="relative">
                    <div className="absolute inset-0 w-full bg-[#F3F3F8]" style={{ boxShadow: 'none' }}>
                        <div className="w-full px-4" style={{ margin: '0', maxWidth: 'none' }}>
                            <Statistics 
                                dateRange={dateRange} 
                                storeId={selectedStoreId} 
                            />
                        </div>
                    </div>
                    <div className="invisible">
                        <Statistics 
                            dateRange={dateRange} 
                            storeId={selectedStoreId} 
                        />
                    </div>
                </div>
                <div className="px-4">
                    {selectedStoreId === 'all' ? (
                        <>
                            {/* Analytics Section */}
                            <div className="mb-6 flex flex-col gap-4 md:flex-row md:gap-6">
                                <div className="w-full md:w-[70%] h-[400px] md:h-[500px]">
                                    <SalesAnalyticsArea storeId={selectedStoreId} />
                                </div>
                                <div className="w-full md:w-[30%] h-[500px]">
                                    <SalesByStore 
                                        storeId={selectedStoreId}
                                        dateRange={dateRange}
                                    />
                                </div>
                            </div>
                            
                            {/* Categories and Leaderboard */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <SalesByCategory 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                                <SalesTeamLeaderboard 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                            </div>

                            {/* TopSelling and StockIndex side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <TopSelling 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                                <StockIndex storeId={selectedStoreId} />
                            </div>
                            
                            {/* Orders and Payments Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <OrdersList 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                                <PaymentsList 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* First row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SalesAnalyticsArea storeId={selectedStoreId} />
                                <SalesByCategory 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                            </div>
                            
                            {/* Second row - Bestsellers and StockIndex */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <TopSelling 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                                <SalesTeamLeaderboard 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                            </div>

                            {/* Third row - Stock Index */}
                            <div className="w-full">
                                <StockIndex storeId={selectedStoreId} />
                            </div>

                            {/* Fourth row - Orders and Payments */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <OrdersList 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                                <PaymentsList 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardA;