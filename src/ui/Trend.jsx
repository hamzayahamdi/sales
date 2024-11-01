// components
import {Fragment} from 'react';

// utils
import classNames from 'classnames';

const Background = ({children, isPositive}) => {
    return (
        <div className={classNames('h-9 flex items-center justify-center pl-4 pr-5 rounded-xl', {
            'bg-[#F4FFFF] dark:bg-sidebar border border-turquoise dark:border-sidebar': isPositive,
            'bg-[#FFF3F4] dark:bg-[#4E3130] border border-red dark:border-[#4E3130]': !isPositive
        })}>
            {children}
        </div>
    )
}

const Trend = ({value = 0, label = 'vc yesterday', suffix = '', labelClass = '', withBg}) => {
    const isPositive = value > 0;
    const Wrapper = withBg ? Background : Fragment;
    const wrapperProps = withBg ? {isPositive} : {};

    return (
        <Wrapper {...wrapperProps}>
            <div className="flex gap-1">
                <div className="flex items-center gap-2"
                     style={{color: isPositive ? 'var(--turquoise)' : 'var(--red)'}}>
                    <i className={`icon-arrow-trend-${isPositive ? 'up' : 'down'}-regular mt-1`}/>
                    <span className="font-semibold">{isPositive && '+'}{value}{suffix}</span>
                </div>
                <span className={labelClass}>{label}</span>
            </div>
        </Wrapper>
    )
}

export default Trend