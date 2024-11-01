// components
import Spring from '@components/Spring';
import IconButton from '@ui/IconButton';
import Collapse from '@mui/material/Collapse';

// constants
import {ORDER_STATUSES} from '@constants/options';

// utils
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const OrderCollapse = ({order, active, setActive, index, withSubmenu}) => {
    const status = ORDER_STATUSES.find(item => item.value === order.status);

    const toggleCollapse = () => {
        if (active === order.id) {
            setActive('');
        } else {
            setActive(order.id);
        }
    }

    return (
        <Spring className="card-container card-container--light p-4 rounded-2xl" type="slideUp" index={index}>
            <div className="flex items-center justify-between">
                <span className="font-semibold text-header">#{order.id}</span>
                <div className="flex items-center gap-4">
                    <button className={`btn-collapse ${active === order.id ? 'active' : ''}`}
                            onClick={toggleCollapse}
                            aria-label="Toggle">
                        <i className="icon-chevron-down-regular"/>
                    </button>
                    {
                        withSubmenu && <IconButton className="dark:bg-widget dark:border-widget" />
                    }
                </div>
            </div>
            <Collapse in={active === order.id}>
                <div className="border rounded-[10px] mt-4">
                    <table className="w-full border-collapse">
                        <tbody>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b" colSpan="2">
                                Customer
                            </td>
                        </tr>
                        <tr>
                            <td className="p-2 border-b" colSpan="2">
                                {order.user.firstName} {order.user.lastName}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b border-r">
                                Amount:
                            </td>
                            <td className="p-2 border-b">
                                ${order.amount}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b border-r">
                                Method:
                            </td>
                            <td className="p-2 border-b">
                                {order.method}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-b border-r">
                                Date:
                            </td>
                            <td className="p-2 border-b">
                                {dayjs(order.date).format('DD.MM.YY')}
                            </td>
                        </tr>
                        <tr>
                            <td className="font-semibold text-header p-2 border-r">
                                Status:
                            </td>
                            <td className="p-2" style={{color: `var(--${status.color})`}}>
                                {status.label}
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </Collapse>
        </Spring>
    )
}

OrderCollapse.propTypes = {
    order: PropTypes.object.isRequired,
    active: PropTypes.string.isRequired,
    setActive: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    withSubmenu: PropTypes.bool
}

export default OrderCollapse