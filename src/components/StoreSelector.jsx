import { FormControl, Select, MenuItem } from '@mui/material';

const stores = [
    { id: 'all', name: 'Tous les magasins' },
    { id: '1', name: 'Casablanca' },
    { id: '2', name: 'Rabat' },
    { id: '5', name: 'Tanger' },
    { id: '6', name: 'Marrakech' },
    { id: '10', name: 'Outlet' }
];

const StoreSelector = ({ value, onChange }) => {
    return (
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--border-hover)',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'var(--primary)',
                    },
                    '& .MuiSelect-select': {
                        color: 'var(--text)',
                        fontSize: '14px',
                    }
                }}
            >
                {stores.map((store) => (
                    <MenuItem key={store.id} value={store.id}>
                        {store.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default StoreSelector; 