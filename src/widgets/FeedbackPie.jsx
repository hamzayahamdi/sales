// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import ChartLegend from '@ui/ChartLegend';
import {ResponsiveContainer, PieChart, Pie, Cell, Tooltip} from 'recharts';

// hooks
import {useState} from 'react';

// constants
import {PERIODS} from '@constants/options';

const data = [
    {
        name: 'Positive',
        value: {
            week: 400,
            month: 600,
            year: 800
        },
        color: 'var(--turquoise)'
    },
    {
        name: 'Neutral',
        value: {
            week: 200,
            month: 150,
            year: 250
        },
        color: 'var(--yellow)'
    },
    {
        name: 'Negative',
        value: {
            week: 100,
            month: 198,
            year: 356
        },
        color: 'var(--red)'
    }
]

const getPercentage = (value, period) => {
    const total = data.reduce((acc, item) => acc + item.value[period.value], 0);
    const percentage = (value * 100) / total;

    return `${percentage.toFixed(0)}%`
}

const CustomTooltip = ({active, payload, period}) => {
    if (active) {
        return (
            <div className="basic-tooltip">
                {getPercentage(payload[0].value, period)}
            </div>
        )
    }

    return null
}

const FeedbackPie = () => {
    const [period, setPeriod] = useState(PERIODS[0]);

    return (
        <Spring className="card flex flex-col p-5 h-[392px] xs:p-6 md:h-full">
            <div className="flex gap-4 items-center justify-between">
                <h2>Feedback</h2>
                <div className="min-w-[105px]">
                    <Select value={period} onChange={setPeriod} options={PERIODS}/>
                </div>
            </div>
            <div className="flex-1 overflow-hidden -m-2.5">
                <ResponsiveContainer width="99%" height="100%">
                    <PieChart margin={false}>
                        <Pie data={data}
                             dataKey={`value.${period.value}`}
                             strokeWidth={0}
                             innerRadius={70}>
                            {
                                data.map((item, index) => (
                                    <Cell key={index} fill={item.color}/>
                                ))
                            }
                        </Pie>
                        <Tooltip content={<CustomTooltip period={period}/>}/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex gap-4 justify-center">
                {
                    data.map((item, index) => (
                        <ChartLegend key={index} color={item.color} label={item.name}/>
                    ))
                }
            </div>
        </Spring>
    )
}

export default FeedbackPie