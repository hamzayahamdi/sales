import { useState } from 'react';
import dayjs from 'dayjs';
import { FaMobileAlt } from 'react-icons/fa';
import { useWindowSize } from 'react-use';

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
    
    // Get user role and store from localStorage
    const userRole = localStorage.getItem('userRole');
    const userStore = localStorage.getItem('userStore');
    
    const [dateRange, setDateRange] = useState(defaultDateRange);
    // For store managers, always use their store ID
    const [selectedStoreId, setSelectedStoreId] = useState(() => {
        if (userRole === 'store_manager') {
            if (userStore === '2') {
                return '2'; // Default to Rabat
            }
            return userStore;
        }
        return '1';
    });
    const { storeSales, loading } = useStoreSales(dateRange);
    const { width } = useWindowSize();

    // Update store ID handler to respect store manager restrictions
    const handleStoreChange = (newStoreId) => {
        if (userRole === 'store_manager') {
            // Special case for Rabat/Outlet manager
            if (userStore === '2') {
                // Allow switching between Rabat (2) and Outlet (10)
                if (newStoreId === '2' || newStoreId === '10') {
                    setSelectedStoreId(newStoreId);
                }
                return;
            }
            // Other store managers can't switch stores
            return;
        }
        // Admin and comptabilite can switch to any store
        setSelectedStoreId(newStoreId);
    };

    // Get user role from localStorage
    const isAuthorizedUser = () => {
        return userRole === 'store_manager' || userRole === 'comptabilite';
    };

    // Add a separate check for admin
    const isAdminUser = () => {
        return userRole === 'admin';
    };

    return (
        <div className="bg-[#F3F3F8] min-h-screen w-full">
            <div className="w-full">
                <AppBar 
                    title="Dashboard"
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    selectedStoreId={selectedStoreId}
                    onStoreChange={handleStoreChange}
                    storeSales={storeSales}
                    loading={loading}
                />
            </div>
            <div className={`space-y-6 pb-24 ${
                width < 768 || userRole === 'admin' || userRole === 'comptabilite' 
                    ? 'mt-3' 
                    : '-mt-[15px]'
            } pt-0`}>
                {userRole === 'store_manager' ? (
                    <>
                        {/* Show on mobile */}
                        <div className="md:hidden">
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
                        </div>

                        {/* Show message on desktop - Moved closer to header */}
                        <div className="hidden md:block px-4 -mt-3 mb-1">
                            <div className="bg-white/80 backdrop-blur-sm rounded-lg py-1.5 px-3 border border-gray-100 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                    <FaMobileAlt className="w-3 h-3 text-[#599AED]" />
                                </div>
                                <p className="text-xs text-gray-500">
                                    Statistiques disponibles sur mobile uniquement
                                </p>
                            </div>
                        </div>
                    </>
                ) : (
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
                )}
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
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                <div className="md:col-span-3">
                                    <OrdersList 
                                        storeId={selectedStoreId}
                                        dateRange={dateRange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <PaymentsList 
                                        storeId={selectedStoreId}
                                        dateRange={dateRange}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            {/* Orders and Payments - Only for store managers and comptabilite */}
                            {isAuthorizedUser() && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                    <div className="md:col-span-3">
                                        <OrdersList 
                                            storeId={selectedStoreId}
                                            dateRange={dateRange}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <PaymentsList 
                                            storeId={selectedStoreId}
                                            dateRange={dateRange}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Rest of the sections */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SalesAnalyticsArea storeId={selectedStoreId} />
                                <SalesByCategory 
                                    storeId={selectedStoreId}
                                    dateRange={dateRange}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="grid grid-rows-2 gap-6">
                                    <SalesTeamLeaderboard 
                                        storeId={selectedStoreId}
                                        dateRange={dateRange}
                                    />
                                    <StockIndex storeId={selectedStoreId} />
                                </div>
                                <div className="h-full">
                                    <TopSelling 
                                        storeId={selectedStoreId}
                                        dateRange={dateRange}
                                    />
                                </div>
                            </div>

                            {/* Orders and Payments - Only for admin */}
                            {isAdminUser() && (
                                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                                    <div className="md:col-span-3">
                                        <OrdersList 
                                            storeId={selectedStoreId}
                                            dateRange={dateRange}
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <PaymentsList 
                                            storeId={selectedStoreId}
                                            dateRange={dateRange}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardA;