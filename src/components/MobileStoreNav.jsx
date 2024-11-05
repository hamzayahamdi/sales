import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';

const MobileStoreNav = ({ selectedStoreId, onStoreChange, isDesktop, storeSales = {}, loading }) => {
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
            <div style={{ backgroundColor: '#0F172A' }} className="rounded-xl p-2 shadow-xl">
                <div className="flex overflow-x-auto scrollbar-hide gap-2">
                    {STORES.map((store) => {
                        const isSelected = selectedStoreId === store.value;
                        const buttonStyles = {
                            width: '100%',
                            backgroundColor: isSelected ? '#2563EB' : '#1F2937',
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

export default MobileStoreNav; 