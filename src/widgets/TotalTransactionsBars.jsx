// components
import Spring from '@components/Spring';
import ChartLegend from '@ui/ChartLegend';
import {BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

const data = [
    {
        name: 'Monday',
        a: 4000,
        b: 2400,
        c: 2400
    },
    {
        name: 'Tuesday',
        a: 3000,
        b: 1398,
        c: 2210
    },
    {
        name: 'Wednesday',
        a: 2000,
        b: 9800,
        c: 2290
    },
    {
        name: 'Thursday',
        a: 2780,
        b: 3908,
        c: 2000
    },
    {
        name: 'Friday',
        a: 1890,
        b: 4800,
        c: 2181
    },
    {
        name: 'Saturday',
        a: 2390,
        b: 3800,
        c: 2500
    },
    {
        name: 'Sunday',
        a: 3490,
        b: 4300,
        c: 2100
    }
];

const CustomTooltip = ({active, payload}) => {
    if (active) {
        return (
            <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded-md shadow-lg dark:bg-body">
                {
                    payload.map((item, index) => (
                        <ChartLegend key={index} color={item.fill} label={`$${item.value}`}/>
                    ))
                }
            </div>
        );
    }

    return null;
}

const TotalTransactionsBars = () => {
    return (
        <Spring className="card flex flex-col p-5 h-[392px] md:h-full">
            <div className="flex flex-col gap-2.5 xs:flex-row xs:items-center xs:justify-between md:flex-col
                 md:items-stretch lg:flex-row lg:items-center">
                <h2>Total Transactions</h2>
                <button className="btn--base h-9 px-6 rounded-[10px] text-label min-w-[105px]">
                    Export
                </button>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 mb-5 md:justify-end">
                <ChartLegend color="var(--turquoise)" label="This Week"/>
                <ChartLegend color="var(--blue)" label="Last Week"/>
                <ChartLegend color="var(--peach)" label="Cost"/>
            </div>
            <div className="flex-1 overflow-hidden">
                <ResponsiveContainer width="99%" height="100%">
                    <BarChart data={data} margin={{top: 1, right: 0, left: 0, bottom: 1}}>
                        <CartesianGrid vertical={false}
                                       stroke="var(--cartesian-grid)"
                                       strokeDasharray="8 8"/>
                        <Tooltip cursor={false} content={<CustomTooltip/>}/>
                        <Bar dataKey="b"
                             stackId="a"
                             fill="var(--turquoise)"
                             maxBarSize={30}
                             radius={[0, 0, 8, 8]}/>
                        <Bar dataKey="a"
                             stackId="a"
                             fill="var(--blue)"
                             maxBarSize={30}/>
                        <Bar dataKey="c"
                             stackId="a"
                             fill="var(--peach)"
                             maxBarSize={30}
                             radius={[8, 8, 0, 0]}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Spring>
    )
}

export default TotalTransactionsBars