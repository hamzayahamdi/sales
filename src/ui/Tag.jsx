// components
import Grow from '@mui/material/Grow';

// utils
import PropTypes from 'prop-types';

const Tag = ({className, value, onClick, role}) => {
    return (
        <Grow in={true} timeout={450}>
            <div className="will-change-transform">
                <div className={`tag btn--base ${role || ''} ${className || ''}`}>
                    {value}
                    <button className="text-[10px] text-red mt-0.5"
                            onClick={onClick}
                            aria-label="Delete tag">
                        <i className="icon-xmark-regular"/>
                    </button>
                </div>
            </div>
        </Grow>
    )
}

Tag.propTypes = {
    className: PropTypes.string,
    value: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    role: PropTypes.string
}

export default Tag