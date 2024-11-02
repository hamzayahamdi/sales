import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';

const MobileNav = ({ selectedStoreId, onStoreChange, isDesktop }) => {
    const STORES = [
        { value: '1', label: 'Casablanca' },
        { value: '2', label: 'Rabat' },
        { value: '6', label: 'Marrakech' },
        { value: '5', label: 'Tanger' },
        { value: '10', label: 'Outlet' },
        { value: 'all', label: 'Tous les magasins' }
    ];

    return (
        <nav className={isDesktop ? '' : 'fixed bottom-8 left-1/2 -translate-x-1/2 z-50'}>
            <div className="flex items-center bg-[#1a2942] shadow-lg rounded-full p-1.5">
                {STORES.map((store) => {
                    const isSelected = selectedStoreId === store.value;
                    
                    return (
                        <button
                            key={store.value}
                            onClick={() => onStoreChange(store.value)}
                            style={{
                                minWidth: isSelected ? (isDesktop ? '180px' : '85px') : (isDesktop ? '45px' : '42px'),
                                backgroundColor: isSelected ? '#5a9bed' : 'transparent',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                cursor: 'pointer',
                                height: '36px'
                            }}
                            className={`
                                relative px-2.5 rounded-full flex items-center justify-center
                                ${isSelected 
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-[#2b3d54]'
                                }
                            `}
                        >
                            {store.value === 'all' ? (
                                <AiOutlineGlobal className={`w-6 h-6 ${isSelected ? '' : 'bg-[#2b3d54] rounded-full'}`} />
                            ) : (
                                <AiOutlineShop className={`w-6 h-6 ${isSelected ? '' : 'bg-[#2b3d54] rounded-full'}`} />
                            )}
                            <span 
                                className={`font-bold ml-2 transition-all duration-300 text-sm
                                    ${isSelected ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
                                `}
                            >
                                {store.value === 'all' 
                                    ? (isDesktop ? 'Tous les magasins' : 'ALL')
                                    : store.label
                                }
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileNav; 