import PropTypes from 'prop-types';

const IconHeader = ({iconClass, title}) => {
    return (
        <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 bg-blue rounded-[5px]">
                <i className={`icon-${iconClass} text-white text-[10px]`}/>
            </span>
            <span className="text-label uppercase text-[15px] font-semibold truncate">
                 {title}
            </span>
        </div>
    )
}

IconHeader.propTypes = {
    iconClass: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default IconHeader