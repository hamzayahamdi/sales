// components
import Spring from '@components/Spring';
import {StyledCalendar} from './styles';

// utils
import dayjs from 'dayjs';
import {dayjsLocalizer} from 'react-big-calendar';

// data placeholder
import schedule from '@db/schedule';

const localizer = dayjsLocalizer(dayjs);

const SaleScheduler = ({activeDate, setActiveDate}) => {
    return (
        <Spring className="card flex flex-1 flex-col h-full p-5 xs:p-6">
            <div className="flex flex-col gap-4 mb-5 md:flex-row md:items-center md:justify-between md:mb-6">
                <div className="flex flex-col gap-1">
                    <h2>{dayjs(activeDate).format('MMMM')}</h2>
                    <p className="uppercase font-semibold text-header">
                        Today: {dayjs().format('MMMM DD, YYYY')}
                    </p>
                </div>
                <button className="btn btn--primary">
                    Add Sale
                </button>
            </div>
            <StyledCalendar
                date={activeDate}
                onNavigate={date => setActiveDate(date)}
                localizer={localizer}
                events={schedule}
                startAccessor="start"
                endAccessor="end"
                allDayAccessor={false}
                defaultView="month"
                min={new Date(2021, 0, 1, 6, 0)}
                max={new Date(2021, 0, 1, 21, 0)}
                step={90}
                formats={{
                    dayFormat: date => dayjs(date).format('ddd, DD'),
                    timeGutterFormat: date => dayjs(date).format('ha')
                }}
                components={{
                    event: ({event}) => {
                        return (
                            <div className={`event bg-${event.color}`}>
                                <p className="truncate">{event.title}</p>
                            </div>
                        )
                    },
                    toolbar: () => null,
                }}
                onShowMore={(events, date) => {
                    console.log(events, date)
                }}
                onDrillDown={() => null}
            />
        </Spring>
    )
}

export default SaleScheduler