// components
import Search from '@ui/Search';
import Modal from '@mui/material/Modal';

// utils
import PropTypes from 'prop-types';

const SearchModal = ({open, setOpen}) => {
    return (
        <Modal open={open}
               onClose={() => setOpen(false)}
               sx={{
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   padding: '16px'
               }}
        >
            <div className="bg-widget flex-1 max-w-[360px] p-5 rounded-2xl border xs:p-6 relative">
                <h3 className="mb-4">What are you looking for?</h3>
                <Search/>
                <button className="absolute top-4 right-5 text-sm text-red xs:right-6"
                        aria-label="Close modal"
                        onClick={() => setOpen(false)}>
                    <i className="icon-xmark-regular"/>
                </button>
            </div>
        </Modal>
    )
}

SearchModal.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired
}

export default SearchModal