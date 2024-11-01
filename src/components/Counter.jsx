// components
import CountUp from 'react-countup';
import VisibilitySensor from 'react-visibility-sensor';

// hooks
import {useState, useEffect} from 'react';

// utils
import PropTypes from 'prop-types';
import {numFormatter, commaFormatter} from '@utils/helpers';

const Counter = ({value, className, isFormatted, ...props}) => {
    const [countFinished, setCountFinished] = useState(false);

    useEffect(() => {
        setCountFinished(false);
    }, [value]);

    return (
        <CountUp start={countFinished ? value : 0}
                 end={value}
                 duration={2}
                 onEnd={() => setCountFinished(true)}
                 formattingFn={isFormatted ? value => numFormatter(value, props.decimals || 0, props.prefix) : null}
                 {...props}>
            {({countUpRef, start}) => (
                <VisibilitySensor onChange={start} active={!countFinished} delayedCall>
                    <span className={`relative ${className || ''}`}>
                        <span className="opacity-0">
                            {isFormatted ? numFormatter(value, props.decimals || 0, props.prefix) : commaFormatter(value)}
                            {props.suffix}
                        </span>
                        <span className="absolute left-0" ref={countUpRef}/>
                    </span>
                </VisibilitySensor>
            )}
        </CountUp>
    )
}

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    className: PropTypes.string,
}

export default Counter