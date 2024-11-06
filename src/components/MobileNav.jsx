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
            color: '#22C55E'
        },
        { 
            value: '2', 
            label: 'Rabat',
            shortLabel: 'Rabat', 
            getStat: () => formatStat(storeSales?.['2'] || 0),
            color: '#F97316'
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            getStat: () => formatStat(storeSales?.['6'] || 0),
            color: '#EC4899'
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
            color: '#EAB308'
        },
        { 
            value: 'all', 
            label: 'Tous les magasins',
            shortLabel: 'Tous', 
            getStat: () => formatStat(storeSales?.['all'] || 0),
            color: '#06B6D4'
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
                                backgroundColor: isSelected ? store.color : '#f3f4f6',
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
            <div className="bg-gradient-to-r from-[#2C3E50] to-[#3498DB] rounded-xl p-2 shadow-lg">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        const buttonStyles = {
                            width: '100%',
                            backgroundColor: isSelected ? store.color : 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: isSelected ? 'none' : 'blur(8px)',
                            borderRadius: '0.5rem',
                            padding: '0.5rem',
                            WebkitAppearance: 'none',
                            WebkitBorderRadius: '0.5rem',
                            display: 'block',
                            transition: 'all 0.2s ease',
                            border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                            boxShadow: isSelected ? 'none' : '0 2px 4px rgba(0,0,0,0.1)'
                        };

                        return (
                            <div
                                key={store.value}
                                style={{
                                    width: isSelected ? '140px' : '72px',
                                    flexShrink: 0,
                                    transition: 'width 0.2s ease'
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
                                                color: '#ffffff'
                                            }} />
                                        ) : (
                                            <AiOutlineShop style={{ 
                                                width: '1rem',
                                                height: '1rem',
                                                color: '#ffffff'
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
                                            color: '#ffffff',
                                            whiteSpace: isSelected ? 'normal' : 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {isSelected ? store.label : store.shortLabel}
                                        </div>
                                        <div style={{ 
                                            fontSize: '0.625rem',
                                            marginTop: '0.125rem',
                                            color: 'rgba(255, 255, 255, 0.8)'
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