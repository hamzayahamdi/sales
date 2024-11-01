// components
import LinearProgress from '@mui/material/LinearProgress';

// hooks
import {useTheme} from '@contexts/themeContext';

// utils
import PropTypes from 'prop-types';
import {memo} from 'react';

const ProgressBar = ({value = 0, color = 'blue', ...props}) => {
    const {theme} = useTheme();
    const borderColor = theme === 'light' ? 'var(--border)' : 'var(--body)';
    const bgColor = theme === 'light' ? 'var(--header-dark)' : 'var(--body)';

    return (
        <LinearProgress
            variant="determinate"
            aria-label={`${value.toFixed(0)}%`}
            value={value}
            classes={{
                root: props.className || '',
            }}
            sx={{
                height: 10,
                borderRadius: 3,
                backgroundColor: bgColor,
                border: `1px solid ${borderColor}`,
                flexGrow: 1,
                '& .MuiLinearProgress-bar': {
                    backgroundColor: `var(--${color})`,
                    borderRadius: 8,
                    transform: value === 0 ? 'translateX(-110%) !important' : 'none',
                    height: 8,
                }
            }}
            {...props}
        />
    )
}

ProgressBar.propTypes = {
    value: PropTypes.number,
    color: PropTypes.string,
}

export default memo(ProgressBar)