// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// utils
import PropTypes from 'prop-types';

const StyledBasicCheckbox = styled.div`
  input {
    display: none;

    &:checked + label {
      border-color: var(--peach) !important;
      background: var(--peach)  !important;

      i {
        opacity: 1;
      }
    }
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 15px;
    height: 15px;
    background: ${theme('theme', {
      light: '#fff',
      dark: 'transparent'
    })};
    border: 1px solid ${theme('theme', {
      light: 'var(--border)',
      dark: 'var(--text-light)'
    })};
    border-radius: 4px;
    transition: all var(--transition);

    i {
      font-size: 10px;
      color: #fff;
      margin-top: -1px;
      opacity: 0;
      transition: all var(--transition);
    }
  }
`;

const BasicCheckbox = ({id, labelClass, ...props}) => {
    return (
        <StyledBasicCheckbox>
            <input type="checkbox"
                   id={id}
                   checked={props.checked}
                   onChange={props.onChange}/>
            <label className={labelClass || ''} htmlFor={id}>
                <i className="icon-check-regular"/>
            </label>
        </StyledBasicCheckbox>
    )
}

BasicCheckbox.propTypes = {
    id: PropTypes.string.isRequired,
    labelClass: PropTypes.string
}

export default BasicCheckbox