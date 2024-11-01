import PropTypes from 'prop-types';

const IconButton = ({ariaLabel = 'Show actions', onClick, className, iconClass = 'icon-ellipsis-vertical-regular'}) => {
    return (
        <button className={`btn--base h-9 w-9 text-label rounded-[10px] text-[18px] leading-none shrink-0 ${className}`}
                aria-label={ariaLabel}
                onClick={onClick}>
            <i className={iconClass}/>
        </button>
    )
}

IconButton.propTypes = {
    ariaLabel: PropTypes.string,
    onClick: PropTypes.func,
    className: PropTypes.string,
    iconClass: PropTypes.string
}

export default IconButton