// components
import Spring from '@components/Spring';
import ChartLegend from '@ui/ChartLegend';
import Chart from 'react-apexcharts';

// hooks
import {useTheme} from '@contexts/themeContext';
import {useWindowSize} from 'react-use';

const legend = [
    {color: '#D3FFE3', label: '< 500'},
    {color: '#88D4AB', label: '< 1000'},
    {color: '#469D89', label: '< 2000'},
    {color: 'var(--heatmap-darkest)', label: '< 6000'}
]

const VisitsHeatmapChart = () => {
    const {theme} = useTheme();
    const {width} = useWindowSize();

    const options = {
        series: [
            {
                name: "9pm",
                data: [
                    {x: 'Mon', y: 1500},
                    {x: 'Tue', y: 480},
                    {x: 'Wed', y: 2000},
                    {x: 'Thu', y: 6000},
                    {x: 'Fri', y: 4000},
                    {x: 'Sat', y: 5000},
                    {x: 'Sun', y: 847}
                ]
            },
            {
                name: "6pm",
                data: [
                    {x: 'Mon', y: 356},
                    {x: 'Tue', y: 480},
                    {x: 'Wed', y: 499},
                    {x: 'Thu', y: 598},
                    {x: 'Fri', y: 1589},
                    {x: 'Sat', y: 5000},
                    {x: 'Sun', y: 4500}
                ]
            },
            {
                name: "3pm",
                data: [
                    {x: 'Mon', y: 407},
                    {x: 'Tue', y: 480},
                    {x: 'Wed', y: 1500},
                    {x: 'Thu', y: 987},
                    {x: 'Fri', y: 3500},
                    {x: 'Sat', y: 1478},
                    {x: 'Sun', y: 5898}
                ]
            },
            {
                name: "9am",
                data: [
                    {x: 'Mon', y: 856},
                    {x: 'Tue', y: 668},
                    {x: 'Wed', y: 789},
                    {x: 'Thu', y: 1560},
                    {x: 'Fri', y: 4000},
                    {x: 'Sat', y: 5000},
                    {x: 'Sun', y: 147}
                ]
            },
            {
                name: "6am",
                data: [
                    {x: 'Mon', y: 980},
                    {x: 'Tue', y: 4800},
                    {x: 'Wed', y: 256},
                    {x: 'Thu', y: 5700},
                    {x: 'Fri', y: 1500},
                    {x: 'Sat', y: 5000},
                    {x: 'Sun', y: 156}
                ]
            },
            {
                name: "3am",
                data: [
                    {x: 'Mon', y: 945},
                    {x: 'Tue', y: 480},
                    {x: 'Wed', y: 1500},
                    {x: 'Thu', y: 887},
                    {x: 'Fri', y: 1005},
                    {x: 'Sat', y: 366},
                    {x: 'Sun', y: 5874}
                ]
            },
            {
                name: "12am",
                data: [
                    {x: 'Mon', y: 480},
                    {x: 'Tue', y: 1550},
                    {x: 'Wed', y: 910},
                    {x: 'Thu', y: 6000},
                    {x: 'Fri', y: 854},
                    {x: 'Sat', y: 125},
                    {x: 'Sun', y: 599}
                ]
            }
        ],
        dataLabels: {
            enabled: false
        },
        xaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            tooltip: {
                enabled: false
            },
            labels: {
                show: width >= 414,
                style: {
                    colors: 'var(--tick)',
                    fontSize: '12px',
                    fontFamily: 'Manrope',
                }
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            },
            labels: {
                show: width >= 414,
                style: {
                    colors: 'var(--tick)',
                    fontSize: '12px',
                    fontFamily: 'Manrope',
                }
            },
            tooltip: {
                enabled: false
            },
        },
        stroke: {
            width: 4,
            colors: ['var(--widget)']
        },
        plotOptions: {
            heatmap: {
                enableShades: false,
                radius: 4,
                colorScale: {
                    ranges: [{
                        from: 0,
                        to: 500,
                        color: '#D3FFE3',
                        name: '< 500',
                    },
                        {
                            from: 501,
                            to: 1000,
                            color: '#88D4AB',
                            name: '< 1000',
                        },
                        {
                            from: 1001,
                            to: 2000,
                            color: '#469D89',
                            name: '< 2000',
                        },
                        {
                            from: 2001,
                            to: 6000,
                            color: theme === 'light' ? '#036666' : '#216161',
                            name: '< 6000',
                        },
                        {
                            from: 6001,
                            to: Infinity,
                            color: theme === 'light' ? '#024747' : '#143b3b',
                        }
                    ]
                },

            }
        },
        legend: {
            show: false
        },
        chart: {
            toolbar: {
                show: false
            },
            parentHeightOffset: 0,
            offsetX: 0,
            offsetY: 0
        },
        grid: {
            show: false,
        },
        states: {
            hover: {
                filter: {
                    type: 'none',
                }
            },
        },
        tooltip: {
            custom: function ({seriesIndex, dataPointIndex, w}) {
                const data = w.globals.initialSeries[seriesIndex].data[dataPointIndex];

                return (
                    '<div class="basic-tooltip">' +
                        '<span class="!text-xs font-medium">' + data.y + '</span>' +
                    '</div>'
                )
            }
        }
    }

    return (
        <Spring className="card flex flex-col p-5 h-full xs:p-6">
            <h2>Visits by Time</h2>
            <div className="flex flex-wrap gap-x-6 gap-y-3 my-4">
                {
                    legend.map(({color, label}) => (
                        <ChartLegend key={label} color={color} label={label} />
                    ))
                }
            </div>
            <div className="flex-1 w-full h-full -mt-6">
                <Chart options={options}
                       series={options.series}
                       height={290}
                       type="heatmap"/>
            </div>
        </Spring>
    )
}

export default VisitsHeatmapChart