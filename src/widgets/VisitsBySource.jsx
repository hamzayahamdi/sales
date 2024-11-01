// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';

// hooks
import {useState, useEffect} from 'react';

// constants
import {PERIODS} from '@constants/options';

const data = [
    {
        name: 'Direct',
        value: {
            week: 1100,
            month: 4550,
            year: 10874
        },
        fill: 'var(--blue)'
    },
    {
        name: 'Social',
        value: {
            week: 1450,
            month: 3700,
            year: 8900
        },
        fill: 'var(--peach)'
    },
    {
        name: 'Email',
        value: {
            week: 850,
            month: 1690,
            year: 3908
        },
        fill: 'var(--turquoise)'
    },
    {
        name: 'Other',
        value: {
            week: 550,
            month: 1080,
            year: 5800
        },
        fill: 'var(--yellow)'
    },
    {
        name: 'Referrals',
        value: {
            week: 1000,
            month: 2600,
            year: 9400
        },
        fill: 'var(--red)'
    }
];

const CustomTooltip = ({active, payload}) => {
    if (active && payload && payload.length) {
        return (
            <div className="basic-tooltip">
                {payload[0].value}
            </div>
        );
    }
    return null;
}

const VisitsBySource = () => {
    const [period, setPeriod] = useState(PERIODS[0]);
    const [animationActive, setAnimationActive] = useState(false);

    useEffect(() => {
        setAnimationActive(true);
        setTimeout(() => setAnimationActive(false), 500);

        return () => setAnimationActive(false);
    }, [period]);

    return (
        <Spring className="card flex flex-col gap-4 p-5 h-[392px] xs:p-6 md:h-full">
            <div className="flex flex-col gap-2.5 xs:flex-row xs:items-center xs:justify-between md:flex-col
                 md:items-stretch lg:flex-row lg:items-center">
                <h2>Visits by Source</h2>
                <div className="min-w-[105px]">
                    <Select value={period} onChange={setPeriod} options={PERIODS}/>
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <ResponsiveContainer width="99%" height="100%" id="visitsBySource">
                    <BarChart data={data}
                              margin={{top: 0, right: 0, left: 10, bottom: 0}}
                              layout="vertical">
                        <XAxis type="number" hide/>
                        <YAxis type="category"
                               dataKey="name"
                               dx={-10}
                               tickLine={false}
                               axisLine={false}/>
                        <Tooltip cursor={false} content={<CustomTooltip/>}/>
                        <Bar dataKey={`value.${period.value}`}
                             isAnimationActive={animationActive}
                             maxBarSize={24}
                             radius={8}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Spring>
    )
}

export default VisitsBySource