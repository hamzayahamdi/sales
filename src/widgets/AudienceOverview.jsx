// components
import Spring from '@components/Spring';
import ChartLegend from '@ui/ChartLegend';
import Select from '@ui/Select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// hooks
import {useState, useEffect} from 'react';
import {useTheme} from '@contexts/themeContext';
import {useWindowSize} from 'react-use';

// constants
import {PERIODS} from '@constants/options';

// utils
import {numFormatter, getFullWeekdayName} from '@utils/helpers';

// data placeholder
import audience from '@db/audience';

const CustomTooltip = ({active, payload, label}) => {
    if (active) {
        return (
            <div className="bg-white p-4 rounded-[10px] shadow-lg min-w-[200px] dark:bg-body">
                <p className="text-sm font-bold uppercase text-header mb-2">
                    {getFullWeekdayName(label)}
                </p>
                <div className="flex flex-col gap-[5px]">
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-[2px]" style={{background: payload[0].color}} />
                            New Revenue
                        </div>
                        ${(payload[0].value).toFixed(2)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-[2px]" style={{background: payload[1].color}} />
                            Orders
                        </div>
                        ${(payload[1].value).toFixed(2)}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-[2px]" style={{background: payload[2].color}} />
                            Refunds
                        </div>
                        ${(payload[2].value).toFixed(2)}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

const AudienceOverview = () => {
    const {width} = useWindowSize();
    const {theme} = useTheme();
    const [period, setPeriod] = useState(PERIODS[0]);
    const [animationActive, setAnimationActive] = useState(false);

    useEffect(() => {
        setAnimationActive(true);
        setTimeout(() => setAnimationActive(false), 2000);

        return () => setAnimationActive(false);
    }, [period]);

    return (
        <Spring className="card flex flex-col h-[392px] p-5 md:h-full">
            <div className="flex flex-col gap-2.5 xs:flex-row xs:items-center xs:justify-between">
                <h2>Audience Overview</h2>
                <div className="min-w-[105px]">
                    <Select options={PERIODS} value={period} onChange={setPeriod} />
                </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 my-4 md:justify-end">
                <ChartLegend color="var(--turquoise)" label="New Revenue" />
                <ChartLegend color="var(--blue)" label="Orders" />
                <ChartLegend color="var(--peach)" label="Refunds" />
            </div>
            <div className="flex-1 overflow-hidden xs:-ml-6 md:-mr-2">
                <ResponsiveContainer width="99%" height="100%">
                    <AreaChart data={audience} margin={false}>
                        <CartesianGrid vertical={false}
                                       stroke="var(--cartesian-grid)"
                                       strokeDasharray="8 8" />
                        <XAxis dataKey="name"
                               tickLine={false}
                               axisLine={false}
                               hide={width < 414}
                               dy={10} />
                        <YAxis tickLine={false}
                               axisLine={false}
                               hide={width < 414}
                               dx={-10}
                               tickFormatter={(value) => numFormatter(value, 0)}/>
                        <Tooltip cursor={false} content={<CustomTooltip />} />
                        <Area type="linear"
                              isAnimationActive={animationActive}
                              activeDot={false}
                              dataKey={`value.${period.value}.newRevenue`}
                              stackId="1"
                              stroke="var(--peach)"
                              fill={theme === 'light' ? '#FFF7F3' : '#3B300A'} />
                        <Area type="linear"
                              isAnimationActive={animationActive}
                              activeDot={false}
                              dataKey={`value.${period.value}.orders`}
                              stackId="1"
                              stroke="var(--blue)"
                              fill={theme === 'light' ? '#F1F7FF' : '#14344A'} />
                        <Area type="linear"
                              isAnimationActive={animationActive}
                              activeDot={false}
                              dataKey={`value.${period.value}.refunds`}
                              stackId="1"
                              stroke="var(--turquoise)"
                              fill={theme === 'light' ? '#F4FFFF' : '#1B3838'} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </Spring>
    )
}

export default AudienceOverview