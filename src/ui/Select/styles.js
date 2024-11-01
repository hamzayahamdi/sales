import styled from 'styled-components/macro';
import theme from 'styled-theming';
import {keyframes} from 'styled-components';
import Select from 'react-select';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const NormalizedSelect = styled(Select)`
  .select {
    &__control {
      cursor: pointer;
      transition: var(--transition);
      border: none;
      min-height: unset;
      border-radius: 4px;
      box-shadow: none;

      &--is-focused, &:hover {
        outline: none;
      }

      &--is-focused .icon {
        transform: rotate(180deg);
      }

      .icon {
        transition: .3s ease-in-out;
      }
    }

    &__single-value {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin: 0;
    }

    &__menu {
      min-width: max-content;
      width: 100%;
      border-radius: 10px;
      z-index: 301;
      animation: ${fadeIn} var(--transition);
      background: ${theme('theme', {
        light: '#fff',
        dark: 'var(--body)',
      })};
      box-shadow: var(--shadow) !important;
      border: 1px solid var(--border);

      &.close {
        animation: ${fadeIn} var(--transition) reverse;
      }

      &-list {
        scroll-behavior: smooth;
        z-index: 301;
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 18px;
        max-height: 180px;
      }
    }

    &__option {
      cursor: pointer;
      transition: var(--transition);
      padding: 0;
      width: fit-content;
      font-size: 14px;

      &:hover,
      &--is-focused,
      &--is-selected {
        background: transparent;
        color: ${theme('theme', {
          light: 'var(--sidebar)',
          dark: 'var(--peach)',
        })};
      }

      &--is-selected {
        font-weight: 600;
      }
    }

    &__indicators {
      display: none;
    }

    &__value-container {
      padding: 0;
    }
  }
`;

export const BasicSelect = styled(NormalizedSelect)`
  .select {
    &__control {
      border: 1px solid var(--border);
      border-radius: 10px;
      height: 50px;
      transition: var(--transition);
      background: var(--input-bg);

      &--is-focused {
        border-color: var(--input-focus-border);
      }
      
      i {
        font-size: 18px;
      }
    }

    &__placeholder {
      color: var(--label);
    }

    &__single-value {
      color: var(--header);
    }

    &__option {
      &:hover,
      &--is-focused,
      &--is-selected {
        color: var(--input-focus-border);
      }

      &--is-selected {
        font-weight: 600;
      }
    }
  }
`;

export const MinimalSelect = styled(NormalizedSelect)`
  .select {
    &__control {
      height: 36px;
      border-radius: 10px;
      border: 1px solid ${theme('theme', {
        light: 'var(--border)',
        dark: 'var(--body)',
      })};
      padding: 0 20px;
      background: ${theme('theme', {
        light: 'var(--header-dark)',
        dark: 'var(--body)',
      })};
      gap: 10px;
      
      i {
        font-size: 10px;
        color: var(--label);
        margin-top: 2px;
      }
    }
    
    &__single-value {
      color: var(--label);
    }
  }
`;