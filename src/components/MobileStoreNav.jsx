import { AiOutlineShop, AiOutlineGlobal } from 'react-icons/ai';

const MobileStoreNav = ({ selectedStoreId, onStoreChange }) => {
    const STORES = [
        { value: '1', label: 'Casa' },
        { value: '2', label: 'Rabat' },
        { value: '6', label: 'Marrakech' },
        { value: '5', label: 'Tanger' },
        { value: '10', label: 'Outlet' },
        { value: 'all', label: 'Tous' }
    ];

    return (
        <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <div className="flex items-center bg-[#1a2942] shadow-lg rounded-full p-2 border border-[#374151]/20">
                {STORES.map((store) => {
                    const isSelected = selectedStoreId === store.value;
                    
                    return (
                        <button
                            key={store.value}
                            onClick={() => onStoreChange(store.value)}
                            style={{
                                minWidth: isSelected ? '100px' : '50px',
                                backgroundColor: isSelected ? '#5a9bed' : 'transparent',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                            }}
                            className={`
                                relative py-3 px-4 rounded-full flex items-center
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
                            {isSelected && (
                                <span className="text-sm font-bold ml-2">
                                    {store.value === 'all' ? 'ALL' : store.label}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default MobileStoreNav; 