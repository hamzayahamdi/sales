import { Tabs, Tab } from '@mui/material';

const stores = [
    { id: '1', name: 'CASABLANCA' },
    { id: '2', name: 'RABAT' },
    { id: '5', name: 'TANGER' },
    { id: '6', name: 'MARRAKECH' },
    { id: '10', name: 'OUTLET' },
    { id: 'all', name: 'TOUS LES MAGASINS' }
];

const StoreTabs = ({ value, onChange }) => {
    return (
        <div className="relative">
            <Tabs 
                value={value} 
                onChange={(e, newValue) => onChange(newValue)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    minHeight: '40px',
                    '& .MuiTabs-scroller': {
                        '& .MuiTabs-flexContainer': {
                            gap: '4px',
                            '@media (min-width: 768px)': {
                                paddingLeft: '16px'
                            }
                        }
                    },
                    '& .MuiTab-root': {
                        color: '#9CA3AF',
                        fontSize: '14px',
                        fontWeight: 500,
                        textTransform: 'none',
                        minHeight: '40px',
                        padding: '8px 16px',
                        backgroundColor: '#111827',
                        borderRadius: '4px 4px 0 0',
                        '&:hover': {
                            backgroundColor: '#374151',
                            color: '#E5E7EB'
                        },
                        '&.Mui-selected': {
                            color: '#E5E7EB',
                            backgroundColor: '#5a9bed'
                        }
                    },
                    '& .MuiTabs-indicator': {
                        display: 'none'
                    }
                }}
            >
                <Tab label="Casa" value="1" />
                <Tab label="Rabat" value="2" />
                <Tab label="Marrakech" value="6" />
                <Tab label="Tanger" value="5" />
                <Tab label="Outlet" value="10" />
                <Tab label="Tous" value="all" />
            </Tabs>
            {/* Blue line under tabs */}
            <div className="h-[5px] w-full bg-[#5a9bed] absolute bottom-0 left-0" />
        </div>
    );
};

export default StoreTabs;

// Add this CSS to your global styles
/*
.hide-scrollbar::-webkit-scrollbar {
    display: none;
}
.hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
*/ 