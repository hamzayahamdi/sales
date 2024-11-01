// components
import Spring from '@components/Spring';
import IconHeader from '@components/IconHeader';
import Counter from '@components/Counter';
import Trend from '@ui/Trend';
import Select from '@ui/Select';
import ProgressBar from '@ui/ProgressBar';

// hooks
import {useState} from 'react';

// constants
import {PERIODS} from '@constants/options';

const data = {
    week: {
        progress: [
            {
                label: 'Clothing',
                value: 1265,
                color: 'blue'
            },
            {
                label: 'Lingerie',
                value: 1548,
                color: 'yellow'
            },
            {
                label: 'Shoes',
                value: 356,
                color: 'peach'
            }
        ]
    },
    month: {
        progress: [
            {
                label: 'Clothing',
                value: 890,
                color: 'blue'
            },
            {
                label: 'Lingerie',
                value: 1548,
                color: 'yellow'
            },
            {
                label: 'Shoes',
                value: 356,
                color: 'peach'
            }
        ]
    },
    year: {
        progress: [
            {
                label: 'Clothing',
                value: 674,
                color: 'blue'
            },
            {
                label: 'Lingerie',
                value: 1548,
                color: 'yellow'
            },
            {
                label: 'Shoes',
                value: 356,
                color: 'peach'
            }
        ]
    }
}

const SalesProgress = () => {
    const [period, setPeriod] = useState(PERIODS[0]);

    const getTotal = () => {
        return data[period.value].progress.reduce((acc, curr) => acc + curr.value, 0);
    }

    const getProgressValue = label => {
        return data[period.value].progress.find(item => item.label === label).value / getTotal() * 100;
    }

    return (
        <Spring className="card h-full p-5 xs:p-6">
            <div className="flex flex-col gap-2.5 mb-4 xs:mb-1 xs:flex-row xs:items-center xs:justify-between">
                <IconHeader iconClass="arrow-down-to-line-solid" title="Total Transactions"/>
                <div className="min-w-[105px]">
                    <Select options={PERIODS} value={period} onChange={setPeriod}/>
                </div>
            </div>
            <div className="flex flex-col gap-6 justify-between md:flex-row md:items-end">
                <div className="flex flex-col gap-2.5">
                    <Counter className="counter"
                             value={getTotal()}
                             prefix="$"/>
                    <Trend labelClass="text-label" value={12} suffix="%" withBg/>
                </div>
                <div className="flex flex-col flex-1 gap-4 max-w-[445px]">
                    {
                        data[period.value].progress.map((item, index) => (
                            <div className="flex items-center" key={index}>
                                <span className="uppercase text-xs font-medium text-label w-[90px] md:w-[110px]">
                                    {item.label}
                                </span>
                                <ProgressBar color={item.color} value={getProgressValue(item.label)}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        </Spring>
    )
}

export default SalesProgress