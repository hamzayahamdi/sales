// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import {RadialBarChart, RadialBar, Tooltip, ResponsiveContainer} from 'recharts';
import ChartLegend from '@ui/ChartLegend';

// hooks
import {useState} from 'react';

// constants
import {PERIODS} from '@constants/options';

const data = [
    {
        name: 'Other',
        values: {
            week: 2000,
            month: 1500,
            year: 3000
        },
        fill: 'var(--yellow)',
    },
    {
        name: 'Lingerie',
        values: {
            week: 3000,
            month: 2000,
            year: 6000
        },
        fill: 'var(--turquoise)',
    },
    {
        name: 'Clothing',
        values: {
            week: 4000,
            month: 3000,
            year: 8500
        },
        fill: 'var(--blue)',
    }
];

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

const SalesByCategoryRadialBar = () => {
    const [period, setPeriod] = useState(PERIODS[0]);

    return (
        <Spring className="card flex flex-col p-5 h-[392px] xs:p-6 md:h-full">
            <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between md:flex-col
                 md:items-stretch lg:flex-row lg:items-center">
                <h2>Sales by Category</h2>
                <div className="min-w-[105px]">
                    <Select variant="minimal"
                            value={period}
                            onChange={setPeriod}
                            options={PERIODS}
                    />
                </div>
            </div>
            <div className="flex-1 overflow-hidden">
                <ResponsiveContainer width="99%" height="100%">
                    <RadialBarChart data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="35%"
                                    outerRadius="100%">
                        <RadialBar maxBarSize={16}
                                   minAngle={15}
                                   cornerRadius={10}
                                   background={{fill: 'var(--border)'}}
                                   clockWise
                                   dataKey={`values.${period.value}`} />
                        <Tooltip cursor={false} content={<CustomTooltip/>} />
                    </RadialBarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-4">
                {
                    data.map((item, index) => (
                        <ChartLegend key={index}
                                     color={item.fill}
                                     label={item.name} />
                    ))
                }
            </div>
        </Spring>
    )
}

export default SalesByCategoryRadialBar