// styling
import styled from 'styled-components/macro';

// components
import {animated, useSpring} from '@react-spring/web';
import Gallery from '@components/Gallery';
import IconButton from '@ui/IconButton';

// utils
import dayjs from 'dayjs';

const StyledNewsTimelineItem = styled.div`
  display: flex;
  gap: 16px;

  .badge {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid var(--turquoise);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;

    span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: var(--turquoise);
    }
  }
`;

const NewsTimelineItem = ({data, index, isLast, props}) => {
    const zoomIn = useSpring({
        from: {opacity: 0, transform: 'scale(0.5)'},
        to: {opacity: 1, transform: 'scale(1)'},
        config: {duration: 300},
        delay: 100 * index,
        ...props
    })

    const drawLine = useSpring({
        from: {height: '0%'},
        to: {height: '100%'},
        config: {duration: 300},
        delay: 100 * index,
        ...props
    })

    const slideUp = useSpring({
        from: {opacity: 0, transform: 'translateY(40px)'},
        to: {opacity: 1, transform: 'translateY(0px)'},
        config: {duration: 300},
        delay: 100 * index,
        ...props
    })

    return (
        <StyledNewsTimelineItem>
            <div className="flex flex-col h-auto items-center">
                <animated.div className="badge" style={zoomIn}>
                    <span/>
                </animated.div>
                <animated.div className="w-[1px] bg-turquoise" style={drawLine}/>
                {
                    isLast && (
                        <animated.div className="badge" style={zoomIn}>
                            <span/>
                        </animated.div>
                    )
                }
            </div>
            <animated.div className="flex flex-1 justify-between gap-5 pb-4" style={slideUp}>
                <div>
                    <span className="font-semibold uppercase text-label">
                        {dayjs(data.date).format('MMM, DD YYYY')}
                    </span>
                    <p className="font-semibold text-[15px] text-header mt-2 mb-1">
                        {data.title}
                    </p>
                    {
                        data.type === 'order' ? (
                            <div className="flex flex-col gap-1 text-xs">
                                <p>Customer: {data.customer}</p>
                                <p>Amount: ${data.amount}</p>
                            </div>
                        ) : null
                    }
                    {
                        data.type === 'review' ? (
                            <div className="flex flex-col gap-2 items-start text-xs">
                                <p className="max-w-[311px]">{data.preview}</p>
                                {
                                    data.media.length > 0 && (
                                        <Gallery images={data.media}/>
                                    )
                                }
                            </div>
                        ) : null
                    }
                </div>
                <IconButton/>
            </animated.div>
        </StyledNewsTimelineItem>
    )
}

export default NewsTimelineItem