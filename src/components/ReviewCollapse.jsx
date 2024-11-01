// components
import Spring from '@components/Spring';
import Collapse from '@mui/material/Collapse';
import BasicCheckbox from '@ui/BasicCheckbox';
import StarRating from '@ui/StarRating';
import TopSellingProductItem from '@components/TopSellingProductItem';

// utils
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const ReviewCollapse = ({ review, active, setActive, index }) => {
    const toggleCollapse = () => {
        if (active === review.id) {
            setActive('');
        } else {
            setActive(review.id);
        }
    }

    return (
        <Spring className="card-container card-container--light p-4 rounded-2xl" type="slideUp" index={index}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <BasicCheckbox id={review.id} labelClass="dark:!border-[var(--label-light)]"/>
                    <TopSellingProductItem product={review.product}
                                           imgSize={40}
                                           titleClass="truncate max-w-[90px] xxs:max-w-[140px] xs:max-w-[180px] sm:max-w-[300px]"
                                           subtitleClass="truncate max-w-[90px] xxs:max-w-[140px] xs:max-w-[180px] sm:max-w-[300px]"
                                           withCategory/>
                </div>
                <button className={`btn-collapse ${active === review.id ? 'active' : ''}`}
                        onClick={toggleCollapse}
                        aria-label="Toggle">
                    <i className="icon-chevron-down-regular"/>
                </button>
            </div>
            <Collapse in={active === review.id}>
                <div className="mt-4 border rounded-[10px]">
                    <table className="border-collapse w-full">
                        <tbody>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b border-r">
                                Date:
                            </td>
                            <td className="p-2 border-b">
                                {dayjs(review.date).format('DD.MM.YY')}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b border-r">
                                Status:
                            </td>
                            <td className="capitalize p-2 border-b">
                                {review.status}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b border-r">
                                Rating:
                            </td>
                            <td className="p-2 border-b">
                                <StarRating value={review.rating}/>
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b" colSpan="2">
                                Review:
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b" colSpan="2">
                                {review.review}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b" colSpan="2">
                                Author:
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2" colSpan="2">
                                {review.user.firstName} {review.user.lastName}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Collapse>
        </Spring>
    )
}

ReviewCollapse.propTypes = {
    review: PropTypes.object.isRequired,
    active: PropTypes.string.isRequired,
    setActive: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
}

export default ReviewCollapse