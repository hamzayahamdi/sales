// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// components
import Spring from '@components/Spring';
import Calendar from 'react-calendar';

// utils
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';

// data placeholder
import schedule from '@db/schedule';

dayjs.extend(isBetween);

const StyledCalendar = styled(Calendar)`
  .react-calendar {
    &__navigation {
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
      padding: 0 8px;
      background: ${theme('theme', {
        light: 'var(--header-dark)',
        dark: 'var(--body)'
      })};
      border: 1px solid ${theme('theme', {
        light: 'var(--border)',
        dark: 'var(--body)'
      })};
      border-radius: 10px;

      &__prev2-button,
      &__next2-button {
        display: none;
      }

      &__label {
        font-size: 15px;
        font-weight: 600;
        color: ${theme('theme', {
          light: 'var(--sidebar)',
          dark: 'var(--turquoise)'
        })};
        width: fit-content;
        flex-grow: unset !important;
        pointer-events: none;
      }

      &__arrow {
        font-size: 14px;
        color: var(--label);
      }
    }

    &__viewContainer {
      max-width: 327px;
      margin: 0 auto;
    }

    &__month-view {
      &__weekdays {
        text-align: center;
        margin-bottom: 13px;

        abbr {
          text-decoration: none;
          text-transform: uppercase;
          font-size: 12px;
          font-weight: 600;
          color: ${theme('theme', {
            light: 'var(--label)',
            dark: 'var(--header)'
          })};
        }
      }

      &__days {
        display: grid !important;
        grid-template-columns: repeat(7, 1fr);
        justify-items: center;

        &__day {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          flex: unset !important;

          &--neighboringMonth {
            color: var(--label);
            opacity: .4;
          }
        }
      }
    }

    &__tile {
      font-size: 14px;
      color: ${theme('theme', {
        light: 'var(--header)',
        dark: 'var(--text)'
      })};
      pointer-events: none;

      &--active {
        font-weight: 600;
        color: var(--turquoise);
      }
      
      &--now {
        color: #fff !important;
        background: var(--turquoise);
      }
    }
  }
`;

const SaleCalendar = ({activeDate, setActiveDate}) => {
   const hasEvents = date => {
        return schedule.some(event => {
            return dayjs(date).isBetween(event.start, event.end, null, '[]')
        })
    }

    return (
        <Spring className="card p-5 min-h-[372px] xs:p-6">
            <h2 className="mb-1.5">Sale Calendar</h2>
            <StyledCalendar locale="en-US"
                            nextLabel={<i className="icon-chevron-right-regular"/>}
                            prevLabel={<i className="icon-chevron-left-regular"/>}
                            navigationLabel={({date}) => (
                                <span>{dayjs(date).format('MMMM')}</span>
                            )}
                            nextAriaLabel="Next month"
                            prevAriaLabel="Previous month"
                            defaultValue={activeDate}
                            onActiveStartDateChange={({activeStartDate}) => setActiveDate(activeStartDate)}
                            tileClassName={({date}) => (
                                hasEvents(date) ? 'react-calendar__tile--active' : ''
                            )}
            />
        </Spring>
    )
}

SaleCalendar.propTypes = {
    activeDate: PropTypes.instanceOf(Date).isRequired,
    setActiveDate: PropTypes.func.isRequired
}

export default SaleCalendar