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
            getStat: () => formatStat(storeSales?.['1'] || 0)
        },
        { 
            value: '2', 
            label: 'Rabat',
            shortLabel: 'Rabat', 
            getStat: () => formatStat(storeSales?.['2'] || 0)
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            getStat: () => formatStat(storeSales?.['6'] || 0)
        },
        { 
            value: '5', 
            label: 'Tanger',
            shortLabel: 'Tanger', 
            getStat: () => formatStat(storeSales?.['5'] || 0)
        },
        { 
            value: '10', 
            label: 'Outlet',
            shortLabel: 'Outlet', 
            getStat: () => formatStat(storeSales?.['10'] || 0)
        },
        { 
            value: 'all', 
            label: 'Tous',
            shortLabel: 'Tous', 
            getStat: () => formatStat(storeSales?.['all'] || 0)
        }
    ];

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="relative bg-[#1B1B1F] shadow-lg rounded-xl p-2">
                <div 
                    className="absolute inset-0 backdrop-blur-xl bg-black/20 rounded-xl"
                    style={{ WebkitBackdropFilter: 'blur(12px)' }}
                />
                <div className="relative flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        return (
                            <div
                                key={store.value}
                                className={`
                                    flex-shrink-0 rounded-lg overflow-hidden
                                    ${isSelected ? 'w-[100px]' : 'w-[72px]'}
                                    transition-all duration-300
                                `}
                            >
                                <button
                                    onClick={() => onStoreChange(store.value)}
                                    className={`
                                        w-full h-full p-2
                                        ${isSelected 
                                            ? 'bg-[#3B82F6]' 
                                            : 'bg-[#1E293B]'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        {store.value === 'all' ? (
                                            <AiOutlineGlobal className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                        ) : (
                                            <AiOutlineShop className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                        )}
                                        {isSelected && (
                                            <IoStatsChartSharp className="w-3.5 h-3.5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            {store.shortLabel}
                                        </div>
                                        <div className={`text-[10px] mt-0.5 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
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