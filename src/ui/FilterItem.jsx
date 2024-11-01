// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// utils
import PropTypes from 'prop-types';

const Button = styled.button`
  text-transform: uppercase;
  font-size: 14px;
  font-weight: 600;
  color: ${theme('theme', {
    light: 'var(--label)',
    dark: 'var(--header)'
  })};
  display: flex;
  align-items: center;
  gap: 11px;
  transition: var(--transition);

  .qty {
    height: 36px;
    min-width: 45px;
    padding: 0 8px;
    border: 1px solid ${theme('theme', {
      light: 'var(--border)',
      dark: 'var(--body)'
    })};
    border-radius: 10px;
    background: ${theme('theme', {
      light: 'var(--header-dark)',
      dark: 'var(--body)'
    })};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: var(--transition);
  }

  &:hover,
  &.active {
    color: ${theme('theme', {
      light: 'var(--sidebar)',
      dark: 'var(--turquoise)'
    })};

    .qty {
      border-color: ${theme('theme', {
        light: 'var(--sidebar)',
        dark: 'var(--turquoise)'
      })};
      background: ${theme('theme', {
        light: 'var(--border)',
        dark: 'transparent'
      })};
    }
  }
`;

const FilterItem = ({label, value, qty, active, setActive}) => {
    return (
        <Button className={active === value ? 'active' : ''} onClick={() => setActive(value)}>
            {label} <span className="qty">({qty})</span>
        </Button>
    )
}

FilterItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    qty: PropTypes.number.isRequired,
    active: PropTypes.string.isRequired,
    setActive: PropTypes.func.isRequired
}

export default FilterItem