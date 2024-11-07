import React from 'react';
import { AiOutlineGlobal, AiOutlineShop } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';

const MobileNav = ({ selectedStoreId, onStoreChange, isDesktop, storeSales = {}, loading }) => {
    const formatStat = (value) => {
        if (loading) return '...';
        if (!storeSales || typeof value === 'undefined') return '0 DH';
        const num = Math.round(value / 1000);
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
            cardGradient: 'bg-gradient-to-br from-[#22C55E] via-[#16A34A] to-[#15803D]'
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            getStat: () => formatStat(storeSales?.['6'] || 0),
            gradient: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]',
            cardGradient: 'bg-gradient-to-br from-[#EF4444] via-[#DC2626] to-[#B91C1C]'
        },
        { 
            value: '5', 
            label: 'Tanger',
            shortLabel: 'Tanger', 
            getStat: () => formatStat(storeSales?.['5'] || 0),
            gradient: 'bg-gradient-to-r from-[#F59E0B] to-[#D97706]',
            cardGradient: 'bg-gradient-to-br from-[#F59E0B] via-[#D97706] to-[#B45309]'
        },
        { 
            value: '10', 
            label: 'Outlet',
            shortLabel: 'Outlet', 
            getStat: () => formatStat(storeSales?.['10'] || 0),
            gradient: 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]',
            cardGradient: 'bg-gradient-to-br from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9]'
        },
        { 
            value: 'all', 
            label: 'Tous',
            shortLabel: 'Tous', 
            getStat: () => formatStat(storeSales?.['all'] || 0),
            gradient: 'bg-gradient-to-r from-[#6366F1] to-[#4F46E5]',
            cardGradient: 'bg-gradient-to-br from-[#6366F1] via-[#4F46E5] to-[#4338CA]'
        }
    ];

    // Desktop version
    if (isDesktop) {
        return (
            <div className="flex gap-3 px-4">
                {STORES.map((store) => {
                    const isSelected = selectedStoreId === store.value;
                    return (
                        <button
                            key={store.value}
                            onClick={() => onStoreChange(store.value)}
                            className={`
                                relative flex items-center gap-3 py-2 px-4 rounded-xl
                                transition-all duration-300 ease-out
                                ${isSelected ? 'min-w-[180px]' : 'min-w-[160px]'}
                                ${isSelected ? store.cardGradient + ' text-white shadow-lg' : 'bg-white hover:bg-gray-50'}
                            `}
                            style={{
                                transform: isSelected ? 'translateY(-1px)' : 'translateY(0)',
                            }}
                        >
                            {/* Icon */}
                            <div className={`
                                flex items-center justify-center w-10 h-10 rounded-lg
                                ${isSelected ? 'bg-white/10' : 'bg-[#F3F3F8]'}
                                transition-all duration-300
                            `}>
                                {store.value === 'all' ? (
                                    <AiOutlineGlobal className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                                ) : (
                                    <AiOutlineShop className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex flex-col items-start min-w-0">
                                <span className={`text-sm font-semibold truncate w-full
                                    ${isSelected ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {store.value === 'all' ? 'Tous les magasins' : store.label}
                                </span>
                                <div className={`
                                    mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium
                                    ${isSelected ? 'bg-white/20 text-white' : 'bg-[#F3F3F8] text-gray-600'}
                                `}>
                                    {store.getStat()}
                                </div>
                            </div>

                            {/* Active Indicator */}
                            {isSelected && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <IoStatsChartSharp className="w-4 h-4 text-white/80" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="bg-[#111827] rounded-xl p-2">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        return (
                            <div
                                key={store.value}
                                style={{ width: isSelected ? '100px' : '72px' }}
                                className="flex-shrink-0"
                            >
                                {isDesktop ? (
                                    <button
                                        onClick={() => onStoreChange(store.value)}
                                        className={`
                                            flex items-center gap-2.5 py-1.5 px-3 rounded-lg
                                            transition-all duration-500 ease-out
                                            ${isSelected ? 'min-w-[160px]' : 'min-w-[140px]'}
                                            ${isSelected ? store.cardGradient + ' text-white' : 'bg-[#f3f4f6] text-gray-600'}
                                        `}
                                        style={{
                                            transform: isSelected ? 'translateY(-1px) scale(1.02)' : 'translateY(0) scale(1)',
                                            boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
                                        }}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            {store.value === 'all' ? (
                                                <AiOutlineGlobal className="w-4 h-4 text-gray-300" />
                                            ) : (
                                                <AiOutlineShop className="w-4 h-4 text-gray-300" />
                                            )}
                                            {isSelected && (
                                                <IoStatsChartSharp className="w-3.5 h-3.5 text-white" />
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start min-w-0">
                                            <span className={`text-sm font-bold truncate w-full transition-all duration-500 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                                {store.label}
                                            </span>
                                            <span className={`
                                                text-[11px] font-medium px-2 py-0.5 rounded-full
                                                ${isSelected ? store.gradient + ' text-white shadow-sm' : 'bg-gray-200/50 text-gray-500'}
                                                transition-all duration-500
                                            `}>
                                                {store.getStat()}
                                            </span>
                                        </div>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onStoreChange(store.value)}
                                        className={`w-full rounded-lg p-2 ${
                                            isSelected ? store.cardGradient + ' text-white' : 'bg-[#1E293B] text-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            {store.value === 'all' ? (
                                                <AiOutlineGlobal className="w-4 h-4 text-gray-300" />
                                            ) : (
                                                <AiOutlineShop className="w-4 h-4 text-gray-300" />
                                            )}
                                            {isSelected && (
                                                <IoStatsChartSharp className="w-3.5 h-3.5 text-white" />
                                            )}
                                        </div>
                                        <div className="flex flex-col items-start min-w-0">
                                            <span className={`text-sm font-bold truncate w-full transition-all duration-500 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                                                {store.label}
                                            </span>
                                            <span className={`
                                                text-[11px] font-medium px-2 py-0.5 rounded-full
                                                ${isSelected ? store.gradient + ' text-white shadow-sm' : 'bg-gray-200/50 text-gray-500'}
                                                transition-all duration-500
                                            `}>
                                                {store.getStat()}
                                            </span>
                                        </div>
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileNav; 