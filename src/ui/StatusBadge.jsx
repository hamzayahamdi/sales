// constants
import {ORDER_STATUSES, PRODUCT_STATUSES} from '@constants/options';

// utils
import PropTypes from 'prop-types';

const StatusBadge = ({status, type = 'order'}) => {
    const options = type === 'order' ? ORDER_STATUSES : PRODUCT_STATUSES;
    const item = options.find(item => item.value === status);

    return (
        <span className="flex items-center justify-center w-fit h-[30px] px-[14px] rounded-[10px] dark:!bg-transparent truncate"
              style={{
                  color: `var(--${item.color})`,
                  border: `1px solid var(--${item.color})`,
                  backgroundColor: item.background,
                  fontWeight: 400,
                  fontSize: 14
              }}>
                    {item.label}
                </span>
    )
}

StatusBadge.propTypes = {
    status: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['order', 'product'])
}

export default StatusBadge