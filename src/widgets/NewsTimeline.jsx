// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import NewsTimelineItem from '@components/NewsTimelineItem';
import ScrollContainer from '@components/ScrollContainer';

// hooks
import {useState} from 'react';
import useMeasure from 'react-use-measure';

// utils
import dayjs from 'dayjs';

// data placeholder
import news from '@db/news';

const options = [
    {value: 'recent', label: 'Recent first'},
    {value: 'oldest', label: 'Oldest first'}
]

const NewsTimeline = () => {
    const [selected, setSelected] = useState(options[0]);
    const [headerRef, {height}] = useMeasure();

    const sortedData = news.sort((a, b) => {
        if (selected.value === 'recent') {
            return dayjs(b.date).diff(a.date)
        } else {
            return dayjs(a.date).diff(b.date)
        }
    })

    return (
        <Spring className="card flex flex-col h-[392px] md:h-full overflow-hidden">
            <div className="flex flex-col gap-2.5 p-5 !pb-[18px] xs:p-6 xs:flex-row xs:items-center xs:justify-between
                 md:flex-col md:items-stretch lg:flex-row lg:items-center"
                 ref={headerRef}>
                <h2>
                    <span className="xl:hidden 4xl:inline">
                        News & Updates
                    </span>
                    <span className="hidden xl:inline 4xl:hidden">
                        News
                    </span>
                </h2>
                <div className="min-w-[140px]">
                    <Select variant="minimal"
                            options={options}
                            value={selected}
                            onChange={setSelected}
                    />
                </div>
            </div>
            <ScrollContainer heightDeps={height}>
                <div className="track p-5 !pt-0 xs:p-6">
                    {
                        sortedData.map((item, index) => (
                            <NewsTimelineItem key={`${selected.value}-${index}`}
                                              data={item}
                                              index={index}
                                              isLast={index === news.length - 1}
                            />
                        ))
                    }
                </div>
            </ScrollContainer>
        </Spring>
    )
}

export default NewsTimeline