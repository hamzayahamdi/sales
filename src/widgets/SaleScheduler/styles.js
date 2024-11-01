import styled from 'styled-components/macro';
import theme from 'styled-theming';
import {Calendar} from 'react-big-calendar';

export const StyledCalendar = styled(Calendar)`
  height: 100%;
  flex-grow: 1;
  min-height: 600px;

  @media screen and (min-width: 768px) {
    min-height: 800px;
  }

  .rbc-month-view {
    border-color: ${theme('theme', {
      light: 'var(--border)',
      dark: 'transparent'
    })};
    background: ${theme('theme', {
      light: 'var(--widget)',
      dark: 'var(--body)'
    })};
    border-radius: 16px;
    overflow: hidden;
  }

  .rbc-month-header {
    height: 50px;

    .rbc-header {
      display: flex;
      justify-content: center;
      align-items: center;
      border-color: var(--border);
      text-transform: uppercase;
      font-size: 12px;
      font-weight: 600;
      color: var(--label);
      
      @media screen and (min-width: 768px) {
        font-size: 15px;
      }
    }
  }

  .rbc-today,
  .rbc-off-range-bg {
    background: transparent;
  }

  .rbc-month-row,
  .rbc-day-bg {
    border-color: var(--border);
  }

  .rbc-date-cell {
    padding: 8px;
    font-weight: 500;
    color: var(--label);

    &.rbc-now {
      font-weight: 600;
      color: ${theme('theme', {
        light: 'var(--sidebar)',
        dark: 'var(--turquoise)'
      })};
    }

    &.rbc-off-range {
      opacity: .4;
    }

    .rbc-button-link {
      pointer-events: none;
    }
  }

  .rbc-event {
    min-height: 24px;
    border-radius: 0;
    padding: 2px 4px;
    background: transparent;
    outline: none !important;
    pointer-events: none;

    .event {
      min-height: 24px;
      display: flex;
      align-items: center;
      border-radius: 10px;
      padding: 2px 10px;
      color: var(--body-dark);
      font-size: 12px;
      line-height: 1.3;
      font-weight: 600;
    }

    @media screen and (min-width: 768px) {
      min-height: 42px;
      
      .event {
        min-height: 42px;
        font-size: 15px;
        padding: 11px 20px;
      }
    }
  }
`;

