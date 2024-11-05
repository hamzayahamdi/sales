import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';

const MobileNav = ({ selectedStoreId, onStoreChange, isDesktop, storeSales = {}, loading }) => {
    const formatStat = (value) => {
        if (loading) return '...';
        if (!storeSales || typeof value === 'undefined') return '0 DH';
        
        // Convert to number and round
        const num = Math.round(value / 1000);
        
        // Format as M if >= 1000K
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
            color: '#3B82F6'
        },
        { 
            value: '2', 
            label: 'Rabat',
            shortLabel: 'Rabat', 
            getStat: () => formatStat(storeSales?.['2'] || 0),
            color: '#10B981'
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            getStat: () => formatStat(storeSales?.['6'] || 0),
            color: '#F43F5E'
        },
        { 
            value: '5', 
            label: 'Tanger',
            shortLabel: 'Tanger', 
            getStat: () => formatStat(storeSales?.['5'] || 0),
            color: '#8B5CF6'
        },
        { 
            value: '10', 
            label: 'Outlet',
            shortLabel: 'Outlet', 
            getStat: () => formatStat(storeSales?.['10'] || 0),
            color: '#F59E0B'
        },
        { 
            value: 'all', 
            label: 'Tous les magasins',
            shortLabel: 'Tous', 
            getStat: () => formatStat(storeSales?.['all'] || 0),
            color: '#6366F1'
        }
    ];

    // Desktop version
    if (isDesktop) {
        return (
            <div className="flex gap-2 px-4">
                {STORES.map((store) => {
                    const isSelected = selectedStoreId === store.value;
                    return (
                        <button
                            key={store.value}
                            onClick={() => onStoreChange(store.value)}
                            className={`
                                flex items-center gap-2.5 py-1.5 px-3 rounded-lg
                                transition-all duration-500 ease-out
                                ${isSelected ? 'min-w-[160px]' : 'min-w-[140px]'}
                            `}
                            style={{
                                backgroundColor: isSelected ? store.color : '#1E293B',
                                transform: isSelected ? 'translateY(-1px) scale(1.02)' : 'translateY(0) scale(1)',
                                boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.15)' : 'none'
                            }}
                        >
                            <div className={`
                                transition-transform duration-500
                                ${isSelected ? 'scale-110' : ''}
                            `}>
                                {store.value === 'all' ? (
                                    <AiOutlineGlobal className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                ) : (
                                    <AiOutlineShop className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-400'}`} />
                                )}
                            </div>
                            <div className="flex flex-col items-start min-w-0">
                                <span className={`
                                    text-sm font-bold truncate w-full transition-all duration-500
                                    ${isSelected ? 'text-white' : 'text-gray-400'}
                                `}>
                                    {store.value === 'all' ? 'Tous les magasins' : store.label}
                                </span>
                                <span className={`
                                    text-[11px] font-medium transition-all duration-500
                                    ${isSelected ? 'text-white/90' : 'text-gray-500'}
                                `}>
                                    {store.getStat()}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        );
    }

    // Mobile version
    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md">
            <div className="bg-[#0A0F1A] rounded-xl p-2 shadow-xl">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        const buttonStyles = {
                            width: '100%',
                            backgroundColor: isSelected ? store.color : '#1F2937',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            WebkitAppearance: 'none',
                            WebkitBorderRadius: '0.5rem',
                            display: 'block'
                        };

                        return (
                            <div
                                key={store.value}
                                style={{
                                    width: isSelected ? '100px' : '72px',
                                    flexShrink: 0,
                                }}
                            >
                                <button
                                    onClick={() => onStoreChange(store.value)}
                                    style={buttonStyles}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        justifyContent: 'space-between',
                                        marginBottom: '0.25rem'
                                    }}>
                                        {store.value === 'all' ? (
                                            <AiOutlineGlobal style={{ 
                                                width: '1rem',
                                                height: '1rem',
                                                color: isSelected ? '#ffffff' : '#9CA3AF'
                                            }} />
                                        ) : (
                                            <AiOutlineShop style={{ 
                                                width: '1rem',
                                                height: '1rem',
                                                color: isSelected ? '#ffffff' : '#9CA3AF'
                                            }} />
                                        )}
                                        {isSelected && (
                                            <IoStatsChartSharp style={{ 
                                                width: '0.875rem',
                                                height: '0.875rem',
                                                color: '#ffffff'
                                            }} />
                                        )}
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            color: isSelected ? '#ffffff' : '#9CA3AF'
                                        }}>
                                            {store.shortLabel}
                                        </div>
                                        <div style={{ 
                                            fontSize: '0.625rem',
                                            marginTop: '0.125rem',
                                            color: isSelected ? '#ffffff' : '#6B7280'
                                        }}>
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