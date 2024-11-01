// components
import Rating from '@mui/material/Rating';
import {ReactComponent as StarSolid} from '@assets/star-solid.svg';
import {ReactComponent as StarRegular} from '@assets/star-regular.svg';

// utils
import PropTypes from 'prop-types';

const StarRating = ({value = 0, readOnly = true, fontSize = 12}) => {
    return (
        <Rating value={value}
                readOnly={readOnly}
                precision={0.5}
                emptyIcon={<StarRegular/>}
                icon={<StarSolid/>}
                sx={{
                    gap: '4px',
                    '& .MuiRating-icon': {
                        color: 'var(--yellow)',
                        width: `${fontSize}px`
                    }
                }}
        />
    )
}

StarRating.propTypes = {
    value: PropTypes.number,
    readOnly: PropTypes.bool,
    fontSize: PropTypes.number
}

export default StarRating

