// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// hooks
import useElementScroll from '@hooks/useElementScroll';

// utils
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Scroller = styled.div`
  height: calc(100% - ${props => props.heightDeps}px);
  position: relative;
  flex-grow: 1;
  width: 100%;
  
  &.default.has-overflow {
    &:before, &:after {
      background: ${theme('theme', {
        light: 'linear-gradient(180deg, rgba(255, 255, 255, 0.0001) 0%, #ffffff 100%)',
        dark: 'linear-gradient(180deg, rgba(26, 21, 12, 0.00) 0%, #1D1D1D 100%);'
      })};
    }
  }

  &.dark.has-overflow {
    &:before, &:after {
      background: ${theme('theme', {
        light: 'linear-gradient(180deg, rgba(255, 255, 255, 0.0001) 0%, #ffffff 100%)',
        dark: 'linear-gradient(180deg, rgba(26, 21, 12, 0.00) 0%, #0B0905 100%)'
      })};
    }
  }

  &.has-overflow {
    &:before, &:after {
      content: '';
      display: block;
      height: 80px;
      position: absolute;
      width: 100%;
      left: 0;
      z-index: 300;
      transition: height var(--transition);
    }

    &:before {
      top: 0;
      transform: scaleY(-1);
    }

    &:after {
      bottom: 0;
    }

    &.is-top:before,
    &.is-bottom:after {
      height: 0;
    }
  }

  .track {
    height: 100%;
    overflow-y: auto;
  }
`;

const ScrollContainer = ({children, heightDeps, variant = 'default'}) => {
    const {ref, isOverflown, isTop, isBottom} = useElementScroll();

    return (
        <Scroller className={classNames(`${variant}`, {'has-overflow': isOverflown, 'is-top': isTop, 'is-bottom': isBottom})}
                  heightDeps={heightDeps}
                  ref={ref}>
            {children}
        </Scroller>
    );
}

ScrollContainer.propTypes = {
    children: PropTypes.node.isRequired,
    heightDeps: PropTypes.number.isRequired,
    variant: PropTypes.oneOf(['default', 'dark'])
}

export default ScrollContainer