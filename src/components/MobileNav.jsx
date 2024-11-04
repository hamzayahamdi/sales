import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';
import './MobileNav.css';

const MobileNav = ({ selectedStoreId, onStoreChange, isDesktop, storeSales = {}, loading }) => {
    const formatStat = (value) => {
        if (loading) return '...';
        if (!storeSales || typeof value === 'undefined') return '0 DH';
        
        // Format the number
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
            gradient: 'from-[#2563EB] to-[#60A5FA]',
            bgHover: 'hover:bg-[#2563EB]',
            getStat: () => formatStat(storeSales?.['1'] || 0)
        },
        { 
            value: '2', 
            label: 'Rabat',
            shortLabel: 'Rabat', 
            gradient: 'from-[#16A34A] to-[#4ADE80]',
            bgHover: 'hover:bg-[#16A34A]',
            getStat: () => formatStat(storeSales?.['2'] || 0)
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            gradient: 'from-[#DC2626] to-[#F87171]',
            bgHover: 'hover:bg-[#DC2626]',
            getStat: () => formatStat(storeSales?.['6'] || 0)
        },
        { 
            value: '5', 
            label: 'Tanger',
            shortLabel: 'Tanger', 
            gradient: 'from-[#7C3AED] to-[#A78BFA]',
            bgHover: 'hover:bg-[#7C3AED]',
            getStat: () => formatStat(storeSales?.['5'] || 0)
        },
        { 
            value: '10', 
            label: 'Outlet',
            shortLabel: 'Outlet', 
            gradient: 'from-[#EA580C] to-[#FB923C]',
            bgHover: 'hover:bg-[#EA580C]',
            getStat: () => formatStat(storeSales?.['10'] || 0)
        },
        { 
            value: 'all', 
            label: 'Tous',
            shortLabel: 'Tous', 
            gradient: 'from-[#0D9488] to-[#2DD4BF]',
            bgHover: 'hover:bg-[#0D9488]',
            getStat: () => formatStat(storeSales?.['all'] || 0)
        }
    ];

    const handleStoreClick = (storeValue) => {
        onStoreChange(storeValue);
    };

    if (isDesktop) {
        return (
            <nav className="flex items-center gap-3">
                {STORES.map((store) => {
                    const isSelected = selectedStoreId === store.value;
                    return (
                        <button
                            key={store.value}
                            onClick={() => handleStoreClick(store.value)}
                            className={`
                                group relative px-4 py-2.5 rounded-xl flex items-center gap-3
                                transition-all duration-300 ease-in-out
                                ${isSelected 
                                    ? `bg-gradient-to-r ${store.gradient} shadow-lg` 
                                    : 'bg-[#1a2942] hover:bg-[#243552]'
                                }
                            `}
                        >
                            {store.value === 'all' ? (
                                <AiOutlineGlobal className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            ) : (
                                <AiOutlineShop className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                            )}
                            <div className="flex flex-col items-start">
                                <span className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                                    {store.label}
                                </span>
                                <span className={`text-xs ${isSelected ? 'text-white/90' : 'text-gray-400 group-hover:text-white/90'}`}>
                                    {store.getStat()}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </nav>
        );
    }

    // Updated mobile version with bolder fonts
    return (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="bg-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] rounded-xl p-2 border border-white/20 backdrop-blur-lg">
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
                                        ? `bg-gradient-to-br ${store.gradient} shadow-lg shadow-${store.gradient.split('-')[2]}/30` 
                                        : 'bg-white/5 hover:bg-white/10 backdrop-blur-lg'
                                    }
                                `}
                                style={{
                                    width: isSelected ? '100px' : '72px',
                                }}
                            >
                                <div className="flex flex-col p-2">
                                    <div className="flex items-center justify-between mb-1">
                                        {store.value === 'all' ? (
                                            <AiOutlineGlobal className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/90'}`} />
                                        ) : (
                                            <AiOutlineShop className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/90'}`} />
                                        )}
                                        {isSelected && (
                                            <IoStatsChartSharp className="w-3.5 h-3.5 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <div className={`text-xs font-bold tracking-wide truncate ${isSelected ? 'text-white' : 'text-white/90'}`}>
                                            {store.shortLabel}
                                        </div>
                                        <div className={`text-[11px] font-semibold mt-0.5 ${isSelected ? 'text-white' : 'text-white/80'}`}>
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