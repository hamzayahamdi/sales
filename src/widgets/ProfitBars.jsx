// components
import Spring from '@components/Spring';
import Counter from '@components/Counter';
import Select from '@ui/Select';
import Trend from '@ui/Trend';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell} from 'recharts';

// hooks
import {useState} from 'react';
import {useWindowSize} from 'react-use';

// constants
import {PERIODS} from '@constants/options';

const data = {
    week: {
        data: [
            {name: 'Mon', value: 2400},
            {name: 'Tue', value: 1398},
            {name: 'Wed', value: 9800},
            {name: 'Thu', value: 3908},
            {name: 'Fri', value: 4800},
            {name: 'Sat', value: 3800},
            {name: 'Sun', value: 4300},
        ],
        trend: 12
    },
    month: {
        data: [
            {name: 'Mon', value: 3845},
            {name: 'Tue', value: 9874},
            {name: 'Wed', value: 6559},
            {name: 'Thu', value: 8700},
            {name: 'Fri', value: 5231},
            {name: 'Sat', value: 4800},
            {name: 'Sun', value: 7554},
        ],
        trend: -5
    },
    year: {
        data: [
            {name: 'Mon', value: 5800},
            {name: 'Tue', value: 7500},
            {name: 'Wed', value: 3200},
            {name: 'Thu', value: 6741},
            {name: 'Fri', value: 1255},
            {name: 'Sat', value: 10200},
            {name: 'Sun', value: 9744},
        ],
        trend: 20
    }
}

const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
        return (
            <div className="basic-tooltip">
                ${payload[0].value}
            </div>
        );
    }

    return null;
}

const ProfitBars = () => {
    const {width} = useWindowSize();
    const [period, setPeriod] = useState(PERIODS[0]);
    const [activeBar, setActiveBar] = useState(null);

    const handleMouseEnter = (data, index) => {
        setActiveBar(index);
    };

    const handleMouseLeave = () => {
        setActiveBar(null);
    };

    const getTotal = () => {
        let total = 0;
        data[period.value].data.forEach(item => {
            total += item.value;
        });
        return total;
    }

    return (
        <Spring className="card flex flex-col p-5 h-[392px] xs:p-6 md:h-full">
            <div className="flex items-center justify-between">
                <h2>Profit</h2>
                <div className="min-w-[105px]">
                    <Select value={period}
                            onChange={setPeriod}
                            options={PERIODS}/>
                </div>
            </div>
            <div className="flex flex-col gap-4 mt-4 mb-6 lg:flex-row lg:items-center lg:justify-between">
                <Counter className="h1"
                         value={getTotal()}
                         prefix="$"/>
                <Trend labelClass="text-label"
                       value={data[period.value].trend}
                       suffix="%"
                       withBg/>
            </div>
            <div className="flex-1 overflow-hidden">
                <ResponsiveContainer width="99%" height="100%">
                    <BarChart data={data[period.value].data} margin={false}>
                        <CartesianGrid stroke="var(--cartesian-grid)"
                                       vertical={false}
                                       strokeDasharray="8 8"/>
                        <XAxis dataKey="name"
                               dy={10}
                               hide={width < 768}
                               tickLine={false}
                               axisLine={false}/>
                        <YAxis dx={-10}
                               hide={width < 768}
                               tickLine={false}
                               axisLine={false}/>
                        <Tooltip cursor={false} content={<CustomTooltip/>}/>
                        <Bar dataKey="value"
                             maxBarSize={30}
                             radius={8}>
                            {
                                data[period.value].data.map((entry, index) => (
                                    <Cell key={`cell-${index}`}
                                          style={{transition: 'fill var(--transition)'}}
                                          fill={activeBar === index ? 'var(--turquoise)' : 'var(--blue)'}
                                          onMouseEnter={() => handleMouseEnter(entry, index)}
                                          onMouseLeave={handleMouseLeave}/>
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Spring>
    )
}

export default ProfitBars