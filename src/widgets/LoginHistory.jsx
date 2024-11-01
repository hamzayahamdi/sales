// components
import Spring from '@components/Spring';
import LoginHistoryItem from '@components/LoginHistoryItem';
import ScrollContainer from '@components/ScrollContainer';

// hooks
import useMeasure from 'react-use-measure';

// utils
import {faker} from '@faker-js/faker';

const data = [
    {title: 'Web', device: 'desktop', timestamp: faker.date.past()},
    {title: 'Ipad', device: 'tablet', timestamp: faker.date.past()},
    {title: 'Iphone', device: 'mobile', timestamp: faker.date.past()},
    {title: 'Web', device: 'desktop', timestamp: faker.date.past()},
    {title: 'Web', device: 'desktop', timestamp: faker.date.past()},
    {title: 'Tablet, Android', device: 'tablet', timestamp: faker.date.past()},
    {title: 'Mobile, Android', device: 'mobile', timestamp: faker.date.past()},
    {title: 'Web', device: 'desktop', timestamp: faker.date.past()},
]

const LoginHistory = () => {
    const [titleRef, {height}] = useMeasure();

    return (
        <Spring className="card h-[600px] md:h-full overflow-hidden">
            <div className="flex flex-col gap-4 p-5 pb-[18px] xs:flex-row xs:justify-between xs:items-center
                 xs:pt-[28px] xs:px-6"
                 ref={titleRef}>
                <h2>Login History</h2>
                <button className="btn btn--sm btn--base w-full xs:w-[115px] text-sidebar dark:text-turquoise hover:border-sidebar
                        dark:hover:border-turquoise">
                    Logout All
                </button>
            </div>
            <ScrollContainer heightDeps={height}>
                <div className="track pb-6 px-4 xs:pb-[28px] xs:px-6">
                    {
                        data.sort((a, b) => b.timestamp - a.timestamp)
                            .map((item, index) => (
                                <LoginHistoryItem key={index}
                                                  data={item}
                                                  isFirstChild={index === 0}
                                                  isLastChild={index === data.length - 1}
                                                  index={index}/>
                            ))
                    }
                </div>
            </ScrollContainer>
        </Spring>
    )
}

export default LoginHistory