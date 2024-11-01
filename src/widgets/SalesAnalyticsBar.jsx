// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import ChartLegend from '@ui/ChartLegend';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

// hooks
import {useState} from 'react';
import {useWindowSize} from 'react-use';

// utils
import {generateGridPoints, numFormatter} from '@utils/helpers';

// constants
import {PERIODS} from '@constants/options';

// data placeholder
import sales_chart from '@db/sales_chart';

const CustomTooltip = ({active, payload, label}) => {
    if (active) {
        console.log(payload)
        return (
            <div className="bg-white dark:bg-body p-3 rounded-[10px] shadow-lg">
                <p className="h3 mb-1.5">{label}</p>
                <div className="flex flex-col gap-1.5 text-[15px] font-semibold text-white">
                    {
                        payload.map((item, index) => (
                            <ChartLegend color={item.fill} label={`$${item.value}`} key={index}/>
                        ))
                    }
                </div>
            </div>
        );
    }

    return null;
}

const SalesAnalyticsBar = () => {
    const {width} = useWindowSize();
    const [period, setPeriod] = useState(PERIODS[0]);
    const points = generateGridPoints('salesAnalyticsBar', 40, 'x');

    return (
        <Spring className="card flex flex-col p-5 h-[392px] xs:p-6 md:h-full">
            <div className="flex flex-col gap-3 xs:flex-row xs:items-center xs:justify-between">
                <h2>Sales Analytics</h2>
                <div className="min-w-[105px]">
                    <Select value={period} onChange={setPeriod} options={PERIODS}/>
                </div>
            </div>
            <div className="flex gap-4 mt-3 mb-5 md:justify-end">
                <ChartLegend color="var(--blue)" label="Previous"/>
                <ChartLegend color="var(--peach)" label="Current"/>
            </div>
            <div className="flex-1 overflow-hidden md:-ml-6 md:-mr-2.5">
                <ResponsiveContainer width="99%" height="100%" id="salesAnalyticsBar">
                    <BarChart data={sales_chart[period.value].data}
                              margin={false}
                              barGap={0}>
                        <CartesianGrid vertical={false}
                                       horizontalPoints={points}
                                       stroke="var(--cartesian-grid)"
                                       strokeDasharray="8 8"/>
                        <XAxis dataKey="name"
                               dy={8}
                               hide={width < 768}
                               tickLine={false}
                               axisLine={false}/>
                        <YAxis tickLine={false}
                               axisLine={false}
                               hide={width < 768}
                               tickFormatter={(value) => numFormatter(value, 0)}
                               tickCount={6}
                               dx={-8}
                        />
                        <Tooltip cursor={false} content={<CustomTooltip/>}/>
                        <Bar dataKey="a"
                             fill="var(--blue)"
                             maxBarSize={width < 768 ? 8 : 24}
                             radius={8}/>
                        <Bar dataKey="b"
                             fill="var(--peach)"
                             maxBarSize={width < 768 ? 8 : 24}
                             radius={8}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Spring>
    )
}

export default SalesAnalyticsBar