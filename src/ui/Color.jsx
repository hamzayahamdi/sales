// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// utils
import PropTypes from 'prop-types';

const StyledColor = styled.div`
  input {
    display: none;
    
    &:checked + label {
      background: transparent;
      border-color: ${theme('theme', {
        light: 'var(--sidebar)',
        dark: 'var(--peach)'
      })};
    }
  }
  
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    transition: all var(--transition);
  }
`;

const Color = ({ type = 'radio', color, name }) => {
    return (
        <StyledColor>
            <input type={type} name={name} id={color} />
            <label className="btn--base" htmlFor={color}>
                <span className="w-8 h-8 rounded-lg" style={{background: color}}/>
            </label>
        </StyledColor>
    )
}

Color.propTypes = {
    type: PropTypes.oneOf(['radio', 'checkbox']),
    color: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}

export default Color