// utils
import {numFormatter} from '@utils/helpers';
import classNames from 'classnames';

const StatisticsNumber = ({item, index, data}) => {
    return (
        <div className={classNames('flex gap-4 px-4 md:h-full md:!p-0 md:justify-center', {
            'pt-4': index === 0,
            'pb-4': index === data.length - 1,
            'md:border-r': index !== data.length - 1
        })}>
            <i className={`icon-${item.icon}-regular text-turquoise text-[24px] mt-[15px]`} />
            <div className="flex flex-col gap-[3px]">
                <span className="counter">{numFormatter(item.value)}</span>
                <span className="uppercase text-xs font-medium text-label">
                    {item.label}
                </span>
            </div>
        </div>
    )
}

export default StatisticsNumber