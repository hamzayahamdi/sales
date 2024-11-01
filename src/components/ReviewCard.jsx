// components
import Spring from '@components/Spring';
import StarRating from '@ui/StarRating';
import Gallery from '@components/Gallery';

// utils
import dayjs from 'dayjs';

const ReviewCard = ({ review, index, className }) => {
    const fullName = `${review.firstName} ${review.lastName}`;

    return (
        <Spring className={`card-container card-container--light rounded-2xl p-5 xs:p-6 ${className || ''}`}
                type="slideUp"
                index={index}>
            <div className="flex flex-col justify-between gap-2.5 xs:items-center xs:flex-row xs:gap-4">
                 <span className="font-medium text-[15px] text-header">
                    {fullName}
                </span>
                <StarRating value={review.rating} />
            </div>
            <p className="max-w-[410px] text-label mt-3 mb-4 xs:mt-2">
                {review.text}
            </p>
            <div className="flex flex-col justify-between items-start xs:flex-row xs:items-center  gap-4">
                {
                    review.media && review.media.length > 0 && (
                        <Gallery images={review.media} />
                    )
                }
                <span className="text-xs ml-auto">
                    {dayjs(review.date).format('MMM DD, YYYY')}
                </span>
            </div>
        </Spring>
    )
}

export default ReviewCard