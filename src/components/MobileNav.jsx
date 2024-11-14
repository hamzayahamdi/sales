import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';
import { IoStatsChartSharp } from 'react-icons/io5';
import { useEffect, useRef } from 'react';

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
            gradient: 'bg-gradient-to-r from-black to-[#434343]',
            cardGradient: 'bg-gradient-to-r from-black to-[#434343]',
            pulseColor: 'rgba(255, 255, 255, 0.9)',
            pulseBg: 'rgba(255, 255, 255, 0.2)'
        },
        { 
            value: '2', 
            label: 'Rabat',
            shortLabel: 'Rabat', 
            getStat: () => formatStat(storeSales?.['2'] || 0),
            cardGradient: 'bg-gradient-to-r from-[#E2E8F0] to-[#94A3B8] !text-gray-900 [&_*]:!text-gray-900',
            pulseColor: 'rgba(0, 0, 0, 0.9)',
            pulseBg: 'rgba(0, 0, 0, 0.1)'
        },
        { 
            value: '6', 
            label: 'Marrakech',
            shortLabel: 'Kech', 
            getStat: () => formatStat(storeSales?.['6'] || 0),
            gradient: 'bg-gradient-to-r from-[#EF4444] to-[#DC2626]',
            cardGradient: 'bg-gradient-to-r from-[#FF0000] to-[#CC0000]',
            pulseColor: 'rgba(255, 255, 255, 0.9)',
            pulseBg: 'rgba(255, 255, 255, 0.2)'
        },
        { 
            value: '5', 
            label: 'Tanger',
            shortLabel: 'Tanger', 
            getStat: () => formatStat(storeSales?.['5'] || 0),
            gradient: 'bg-gradient-to-r from-[#22C55E] to-[#16A34A]',
            cardGradient: 'bg-gradient-to-r from-[#00CC00] to-[#009900]',
            pulseColor: 'rgba(255, 255, 255, 0.9)',
            pulseBg: 'rgba(255, 255, 255, 0.2)'
        },
        { 
            value: '10', 
            label: 'Outlet',
            shortLabel: 'Outlet', 
            getStat: () => formatStat(storeSales?.['10'] || 0),
            gradient: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]',
            cardGradient: 'bg-gradient-to-r from-[#FFD700] to-[#FFA500]',
            pulseColor: 'rgba(255, 255, 255, 0.9)',
            pulseBg: 'rgba(255, 255, 255, 0.3)'
        },
        { 
            value: 'all', 
            label: 'Tous les magasins',
            shortLabel: 'Tous', 
            getStat: () => formatStat(storeSales?.['all'] || 0),
            gradient: 'bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF]',
            cardGradient: 'bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF]',
            pulseColor: 'rgba(255, 255, 255, 0.9)',
            pulseBg: 'rgba(255, 255, 255, 0.2)'
        }
    ];

    const scrollContainerRef = useRef(null);

    const centerSelectedCard = (storeIndex) => {
        if (!scrollContainerRef.current) return;
        
        const container = scrollContainerRef.current;
        const cards = container.children;
        const selectedCard = cards[storeIndex];
        
        if (!selectedCard) return;

        setTimeout(() => {
            const containerWidth = container.offsetWidth;
            const cardWidth = selectedCard.offsetWidth;
            const cardLeft = selectedCard.offsetLeft;
            
            let scrollPosition;
            
            if (storeIndex === 0) {
                scrollPosition = 0;
            } else if (storeIndex === STORES.length - 1) {
                scrollPosition = container.scrollWidth - containerWidth;
            } else {
                scrollPosition = cardLeft - (containerWidth / 2) + (cardWidth / 2);
            }
            
            container.style.scrollBehavior = 'smooth';
            container.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            
            container.scrollTo({
                left: scrollPosition,
                behavior: 'smooth'
            });

            setTimeout(() => {
                container.style.scrollBehavior = '';
                container.style.transition = '';
            }, 800);
        }, 500);
    };

    useEffect(() => {
        const storeIndex = STORES.findIndex(store => store.value === selectedStoreId);
        if (storeIndex !== -1) {
            centerSelectedCard(storeIndex);
        }
    }, [selectedStoreId]);

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
                                flex items-center gap-2.5 py-1.5 px-3 rounded-lg relative
                                transition-all duration-500 ease-out
                                ${isSelected 
                                    ? store.value === 'all' 
                                        ? 'min-w-[200px]' 
                                        : 'min-w-[160px]' 
                                    : 'min-w-[140px]'
                                }
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
                            {isSelected && (
                                <div className="absolute top-2 right-2 w-3 h-3">
                                    <span 
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: store.pulseBg }}
                                    ></span>
                                    <span 
                                        className="absolute inset-0 rounded-full animate-ping"
                                        style={{ backgroundColor: store.pulseColor }}
                                    ></span>
                                    <span 
                                        className="absolute inset-0 rounded-full"
                                        style={{ backgroundColor: store.pulseColor }}
                                    ></span>
                                </div>
                            )}
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
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide gap-3"
                    style={{
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch',
                    }}
                >
                    {STORES.map((store, index) => {
                        const isSelected = selectedStoreId === store.value;
                        const isAccessible = isStoreAccessible(store.value);
                        
                        return (
                            <div
                                key={store.value}
                                className={`
                                    flex-shrink-0 transition-all duration-500 ease-in-out
                                    ${isSelected ? 'w-[220px]' : 'w-[100px]'}
                                `}
                                style={{ 
                                    scrollSnapAlign: 'center',
                                    paddingLeft: index === 0 ? '8px' : '0px',
                                    paddingRight: index === STORES.length - 1 ? '8px' : '0px'
                                }}
                            >
                                <button
                                    onClick={() => isAccessible && onStoreChange(store.value)}
                                    disabled={!isAccessible}
                                    className={`
                                        w-full h-[85px] rounded-lg p-2 
                                        transition-all duration-500 ease-in-out relative
                                        ${isSelected 
                                            ? store.cardGradient + ' text-white transform scale-105' 
                                            : isAccessible
                                                ? 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-200 hover:from-gray-700 hover:to-gray-800'
                                                : 'bg-gradient-to-br from-gray-700 to-gray-800 text-gray-400 opacity-50 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    {isSelected && (
                                        <div className="absolute top-2 right-2 w-3 h-3">
                                            <span 
                                                className="absolute inset-0 rounded-full"
                                                style={{ backgroundColor: store.pulseBg }}
                                            ></span>
                                            <span 
                                                className="absolute inset-0 rounded-full animate-ping"
                                                style={{ backgroundColor: store.pulseColor }}
                                            ></span>
                                            <span 
                                                className="absolute inset-0 rounded-full"
                                                style={{ backgroundColor: store.pulseColor }}
                                            ></span>
                                        </div>
                                    )}
                                    <div className="flex flex-col h-full">
                                        <div className="flex items-center justify-between">
                                            {store.value === 'all' ? (
                                                <AiOutlineGlobal className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                                            ) : (
                                                <AiOutlineShop className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-gray-300'}`} />
                                            )}
                                        </div>
                                        <div className={`
                                            text-xs font-bold mt-1
                                            ${isSelected ? 'text-white min-h-[1.5rem]' : 'text-gray-200 min-h-[1.25rem]'}
                                            transition-all duration-300
                                        `}>
                                            <div className="truncate">
                                                {isSelected ? store.label : store.shortLabel}
                                            </div>
                                        </div>
                                        <div className={`
                                            mt-auto px-2 py-0.5 rounded-full text-[10px] font-medium
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