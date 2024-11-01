// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// utils
import PropTypes from 'prop-types';

const StyledSize = styled.div`
  input {
    display: none;
    
    &:checked + label {
      background: var(--peach);
      border-color: var(--peach);
      color: #fff;
    }
  }
  
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 52px;
    height: 40px;
    border-radius: 10px;
    text-transform: uppercase;
    font-size: 15px;
    font-weight: 600;
    color: ${theme('theme', {
        light: 'var(--sidebar-light)',
        dark: 'var(--header-dark)'
    })};
    transition: all var(--transition);
    
    &:hover {
      border-color: ${theme('theme', {
        light: 'var(--sidebar-light)',
        dark: 'var(--peach)'
      })};
    }
  }
`;

const Size = ({ type = 'radio', size, name }) => {
    return (
        <StyledSize>
            <input type={type} value={size} id={`size-${size}`} name={name} />
            <label className="btn--base" htmlFor={`size-${size}`}>
                {size}
            </label>
        </StyledSize>
    )
}

Size.propTypes = {
    type: PropTypes.oneOf(['checkbox', 'radio']),
    size: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
}

export default Size