// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// utils
import PropTypes from 'prop-types';

const StyledSwitch = styled.div`
  input {
    display: none;

    &:checked + label span {
      left: 22px;
      background: var(--peach);
    }
  }

  label {
    display: block;
    width: 44px;
    height: 24px;
    background: ${theme('theme', {
      light: 'var(--text-dark)',
      dark: 'var(--border-dark)'
    })};
    border-radius: 12px;
    position: relative;

    span {
      display: block;
      width: 18px;
      height: 18px;
      background: #fff;
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 4px;
      transform: translateY(-50%);
      transition: all var(--transition);
    }
  }
`;

const Switch = ({id, checked, onChange}) => {
    return (
        <StyledSwitch>
            <input type="checkbox"
                   id={id}
                   checked={checked}
                   onChange={onChange}/>
            <label htmlFor={id}>
                <span/>
            </label>
        </StyledSwitch>
    )
}

Switch.propTypes = {
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool,
    onChange: PropTypes.func
}

export default Switch