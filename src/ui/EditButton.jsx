import PropTypes from 'prop-types';

const EditButton = ({ isActive, className, onClick }) => {
    return (
        <button className={`btn--base w-[100px] h-9 rounded-[10px] text-label font-semibold text-[15px] ${className || ''}`}
                onClick={onClick}>
            <i className={`icon-${isActive ? 'floppy-disk' : 'pen-to-square'}-regular mr-2.5`}/>
            {isActive ? 'Save' : 'Edit'}
        </button>
    )
}

EditButton.propTypes = {
    isActive: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func
}

export default EditButton