// styling
import styled from 'styled-components/macro';
import theme from 'styled-theming';

// components
import Spring from '@components/Spring';

// utils
import dayjs from 'dayjs';

const timelineItems = [
    {
        title: 'Order Placed',
        description: 'An order has been placed',
        icon: 'bags-shopping',
        date: new Date(2023, 2, 21, 7, 22),
        isActive: true
    },
    {
        title: 'Packed',
        description: 'Picked up by courier partner',
        icon: 'box-open-full',
        date: new Date(2023, 2, 21, 14, 53),
        isActive: true
    },
    {
        title: 'Shipped',
        description: 'QWT Logistics',
        icon: 'truck-fast',
        date: new Date(2023, 2, 22, 10, 44),
        isActive: true
    },
    {
        title: 'Out for Delivery',
        description: 'Your order is out for delivery',
        icon: 'route',
        isActive: false
    },
    {
        title: 'Delivered',
        description: 'Your order has been delivered',
        icon: 'hand-holding-box',
        isActive: false
    }
]

const StyledIcon = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    z-index: 1;
    left: 50%;
    transform: translateX(-50%);
    width: 1px;
    height: calc(100% - 40px);
    background: ${theme('theme', {
      light: 'var(--text-dark)',
      dark: 'var(--border-dark)'
    })};
    display: ${props => props.isLast ? 'none' : 'block'};

    ${props => props.isPrevActive && `
        background: var(--turquoise);
    `};
    
    @media screen and (min-width: 414px) {
        height: calc(100% - 70px);
    }
  }
  
  .wrapper {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 1px solid ${theme('theme', {
      light: 'var(--text-dark)',
      dark: 'var(--border-dark)'
    })};
    border-radius: 10px;
    background: ${theme('theme', {
      light: 'transparent',
      dark: 'var(--border-dark)'
    })};
    color: #DEE4DF;
    position: relative;
    z-index: 2;

    @media screen and (min-width: 414px) {
      width: 70px;
      height: 70px;
    }
    
    ${props => props.isActive && `
    background: transparent;
    color: var(--turquoise);
    border-color: var(--turquoise);
  `}
  }
`;

const TimelineItem = ({data, isPrevActive, isLast}) => {
    return (
        <div className="flex gap-4 items-stretch xs:gap-6">
            <StyledIcon isActive={data.isActive} isPrevActive={isPrevActive} isLast={isLast}>
                <div className="wrapper">
                    <i className={`icon-${data.icon}-${data.isActive ? 'solid' : 'regular'} text-base xs:text-2xl`}/>
                </div>
            </StyledIcon>
            <div className={`${!isLast && 'pb-6 xs:pb-8 xs:min-h-[102px]'}`}>
                <h4 className="mb-1 xs:mb-2">{data.title}</h4>
                <p className="text-[15px] font-medium">{data.description}</p>
                {
                    data.isActive &&
                    <span className="text-xs mt-1">
                        {dayjs(data.date).format('DD MMM YYYY, hh:mm A')}
                    </span>
                }
            </div>
        </div>
    )
}

const TrackOrder = () => {
    return (
        <Spring className="card p-5 h-full xs:p-6">
            <h2>Track Order</h2>
            <p className="text-xs text-label font-medium uppercase mt-2 mb-6">
                Tracking ID: 1004152012012
            </p>
            <div className="flex flex-col">
                {
                    timelineItems.map((item, index) => {
                        return (
                            <TimelineItem key={index}
                                          data={item}
                                          isPrevActive={timelineItems[index + 1]?.isActive}
                                          isLast={index === timelineItems.length - 1}/>
                        )
                    })
                }
            </div>
        </Spring>
    )
}

export default TrackOrder