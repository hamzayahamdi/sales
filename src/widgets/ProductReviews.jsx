// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import ReviewCard from '@components/ReviewCard';
import ScrollContainer from '@components/ScrollContainer';

// hooks
import useMeasure from 'react-use-measure';
import {useState, useRef, useEffect} from 'react';

// constants
import {REVIEWS_SORT} from '@constants/options';

// data placeholder
import reviews from '@db/reviews';

const ProductReviews = () => {
    const [sort, setSort] = useState(REVIEWS_SORT[0]);
    const [headerRef, {height}] = useMeasure();
    const trackRef = useRef();

    const sortedReviews = reviews.sort((a, b) => {
        if (sort.value === 'newest') {
            return b.date - a.date;
        }
        if (sort.value === 'oldest') {
            return a.date - b.date;
        }
        if (sort.value === 'highest') {
            return b.rating - a.rating;
        }
        if (sort.value === 'lowest') {
            return a.rating - b.rating;
        }

        return 0;
    });

    useEffect(() => {
        trackRef && trackRef.current.scrollTo(0, 0);
    }, [sort]);

    return (
        <Spring className="card h-[392px] overflow-hidden md:h-full">
            <div className="flex flex-col gap-2.5 p-5 !pb-[18px] xs:p-6 xs:flex-row xs:items-center xs:justify-between"
                 ref={headerRef}>
                <h2>Product Reviews</h2>
                <Select value={sort} onChange={setSort} options={REVIEWS_SORT}/>
            </div>
            <ScrollContainer heightDeps={height}>
                <div className="track p-5 !pt-0 flex flex-col gap-4" ref={trackRef}>
                    {
                        sortedReviews.map((review, index) => (
                            <ReviewCard key={`${review.id}-${sort.value}`} review={review} index={index}/>
                        ))
                    }
                </div>
            </ScrollContainer>
        </Spring>
    )
}

export default ProductReviews