import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';
import { useEffect } from 'react';

const MobileNav = ({ selectedStoreId, onStoreChange, isDesktop, storeSales = {}, loading }) => {
    const userRole = localStorage.getItem('userRole');
    const userStore = localStorage.getItem('userStore');

    const isStoreAccessible = (storeId) => {
        if (userRole === 'store_manager') {
            if (userStore === '2') {
                return storeId === '2' || storeId === '10';
            }
            return storeId === userStore;
        }
        return true;
    };

    useEffect(() => {
        if (userRole === 'store_manager' && userStore) {
            onStoreChange(userStore);
        }
    }, [userRole, userStore]);

    const formatStat = (value) => {
        if (loading) return '...';
        if (!storeSales || typeof value === 'undefined') return '0 DH';
        
        const num = Math.round(value / 1000);
        if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}M DH`;
        }
        return `${num}K DH`;
    };

    const STORES = [
        { 
            value: '1', 
            label: 'Casablanca', 
            shortLabel: 'Casa',
            getStat: () => formatStat(storeSales?.['1'] || 0),
            gradient: 'bg-gradient-to-r from-[#3B82F6] to-[#2563EB]',
            cardGradient: 'bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8]'
        },
        { 
            value: '2', 
            label: 'Rabat',
            shortLabel: 'Rabat', 
            getStat: () => formatStat(storeSales?.['2'] || 0),
            gradient: 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]',
            cardGradient: 'bg-gradient-to-br from-[#22C55E]/100 via-[#16A34A]/50 to-[#15803D]/25'
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            getStat: () => formatStat(storeSales?.['6'] || 0),
            gradient: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]',
            cardGradient: 'bg-gradient-to-br from-[#EF4444]/100 via-[#DC2626]/50 to-[#B91C1C]/25'
        },
        { 
            value: '5', 
            label: 'Tanger',
            shortLabel: 'Tanger', 
            getStat: () => formatStat(storeSales?.['5'] || 0),
            gradient: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
            cardGradient: 'bg-gradient-to-br from-[#F59E0B]/100 via-[#D97706]/50 to-[#B45309]/25'
        },
        { 
            value: '10', 
            label: 'Outlet',
            shortLabel: 'Outlet', 
            getStat: () => formatStat(storeSales?.['10'] || 0),
            gradient: 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]',
            cardGradient: 'bg-gradient-to-br from-[#8B5CF6]/100 via-[#7C3AED]/50 to-[#6D28D9]/25'
        },
        { 
            value: 'all', 
            label: 'Tous les magasins',
            shortLabel: 'Tous', 
            getStat: () => formatStat(storeSales?.['all'] || 0),
            gradient: 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5]',
            cardGradient: 'bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA]'
        }
    ];

    if (isDesktop) {
        return (
            <div className="flex gap-2 px-4">
                {STORES.map((store) => {
                    const isSelected = selectedStoreId === store.value;
                    const isAccessible = isStoreAccessible(store.value);
                    
                    return (
                        <button
                            key={store.value}
                            onClick={() => isAccessible && onStoreChange(store.value)}
                            disabled={!isAccessible}
                            className={`
                                flex items-center gap-2.5 py-1.5 px-3 rounded-lg
                                transition-all duration-500 ease-out
                                ${isSelected ? 'min-w-[160px]' : 'min-w-[140px]'}
                                ${isSelected 
                                    ? store.cardGradient + ' text-white' 
                                    : isAccessible 
                                        ? 'bg-[#f3f4f6] hover:bg-gray-200'
                                        : 'bg-gray-100 opacity-50 cursor-not-allowed'
                                }
                            `}
                            style={{
                                transform: isSelected ? 'translateY(-1px) scale(1.02)' : 'translateY(0) scale(1)',
                                boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
                            }}
                        >
                            <div className={`
                                transition-transform duration-500
                                ${isSelected ? 'scale-110' : ''}
                            `}>
                                {store.value === 'all' ? (
                                    <AiOutlineGlobal className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                                ) : (
                                    <AiOutlineShop className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-600'}`} />
                                )}
                            </div>
                            <div className="flex flex-col items-start min-w-0">
                                <span className={`
                                    text-sm font-bold truncate w-full transition-all duration-500
                                    ${isSelected ? 'text-white' : 'text-gray-600'}
                                `}>
                                    {store.value === 'all' ? 'Tous les magasins' : store.label}
                                </span>
                                <div className={`
                                    text-[11px] font-medium px-2 py-0.5 rounded-full
                                    ${isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}
                                    transition-all duration-500
                                `}>
                                    {store.getStat()}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="bg-gradient-to-r from-[#1E293B] via-[#334155] to-[#1E293B] rounded-xl p-2 shadow-lg">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        const isAccessible = isStoreAccessible(store.value);
                        
                        return (
                            <div
                                key={store.value}
                                className={`flex-shrink-0 transition-all duration-300 ${
                                    isSelected ? 'w-[140px]' : 'w-[100px]'
                                }`}
                            >
                                <button
                                    onClick={() => isAccessible && onStoreChange(store.value)}
                                    disabled={!isAccessible}
                                    className={`
                                        w-full h-[85px] rounded-lg p-2 transition-all duration-300
                                        ${isSelected 
                                            ? store.cardGradient + ' text-white' 
                                            : isAccessible
                                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 hover:from-gray-700 hover:to-gray-800'
                                                : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 opacity-50 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        {store.value === 'all' ? (
                                            <AiOutlineGlobal className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                                        ) : (
                                            <AiOutlineShop className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                                        )}
                                        {isSelected && (
                                            <IoStatsChartSharp className="w-3.5 h-3.5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className={`
                                            text-xs font-bold 
                                            ${isSelected ? 'text-white min-h-[2rem]' : 'text-gray-200 min-h-[1.25rem]'}
                                            transition-all duration-300
                                        `}>
                                            <div className="truncate">
                                                {isSelected ? store.label : store.shortLabel}
                                            </div>
                                        </div>
                                        <div className={`
                                            mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium
                                            ${isSelected 
                                                ? 'bg-white/20 text-white' 
                                                : 'bg-gray-700 text-gray-200'
                                            }
                                        `}>
                                            {store.getStat()}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileNav;