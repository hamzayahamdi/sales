// components
import Slider from '@mui/material/Slider';

// hooks
import {useTheme} from '@contexts/themeContext';

// utils
import PropTypes from 'prop-types';

const RangeSlider = ({value, onChange, step, min, max, ...props}) => {
    const {theme} = useTheme();

    const handleChange = (event, newValue) => {
        onChange(newValue);
    }

    return (
        <Slider
            {...props}
            value={value}
            onChange={handleChange}
            step={step}
            min={min}
            max={max}
            sx={{
                color: 'var(--peach)',
                '& .MuiSlider-thumb': {
                    width: '15px',
                    height: '15px',
                    '&:hover, &.Mui-focusVisible, &.Mui-active': {
                        boxShadow: '0px 0px 0px 8px rgba(255, 133, 72, 0.16)',
                    },
                    '&:before': {
                        display: 'none',
                    },
                    '&[data-index="0"]': {
                       left: value[0] === min ? '7px !important' : 'unset',
                    },
                    '&[data-index="1"]': {
                        left: value[1] === max ? 'calc(100% - 7px) !important' : 'unset',
                    }
                },
                '& .MuiSlider-track': {
                    height: '2px',
                },
                '& .MuiSlider-rail': {
                    height: '2px',
                    backgroundColor: theme === 'light' ? 'var(--text-dark)' : 'var(--label-light)',
                }
            }}
        />
    );
}

RangeSlider.propTypes = {
    value: PropTypes.arrayOf(PropTypes.number).isRequired,
    onChange: PropTypes.func.isRequired,
    step: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
}

export default RangeSlider