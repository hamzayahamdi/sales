import React from 'react';
import { AiOutlineGlobal, AiOutlineShop } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';

const MobileNav = ({ selectedStoreId, onStoreChange, isDesktop, storeSales = {}, loading }) => {
    // ... other code remains the same

    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="bg-[#1B1B1F]/95 backdrop-blur-lg shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-xl p-2">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        return (
                            <button
                                key={store.value}
                                onClick={() => handleStoreClick(store.value)}
                                className={`
                                    flex-shrink-0 relative rounded-lg
                                    transition-all duration-300 ease-in-out
                                    ${isSelected 
                                        ? `bg-gradient-to-br ${store.gradient} shadow-lg` 
                                        : 'bg-[#1E293B] dark:bg-[#1E293B]'
                                    }
                                    [-webkit-appearance:none]
                                `}
                                style={{
                                    width: isSelected ? '100px' : '72px',
                                    WebkitBackfaceVisibility: 'hidden',
                                    WebkitTransform: 'translate3d(0, 0, 0)',
                                    backgroundColor: isSelected ? undefined : '#1E293B',
                                }}
                            >
                                <div className="flex flex-col p-2">
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
                                        <div className={`text-xs font-bold tracking-wide ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                            {store.shortLabel}
                                        </div>
                                        <div className={`text-[10px] mt-0.5 font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                                            {store.getStat()}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
};

export default MobileNav; 