// components
import Spring from '@components/Spring';

// utils
import PropTypes from 'prop-types';

const OrderInfoCard = ({title, data}) => {
    return (
        <Spring className="card flex flex-col justify-between gap-3 h-full p-5 xs:p-6">
            <h3>{title}</h3>
            <ul className="flex flex-col gap-2.5 md:gap-1.5">
                {
                    data.map(item => (
                        <li className="flex flex-col md:flex-row md:items-center justify-between xl:justify-start"
                            key={item.label} >
                            <span className="uppercase text-xs text-label font-medium w-[120px] shrink-0 xl:w-[160px]
                                  4xl:w-[205px]">
                               {item.label}:
                            </span>
                            <span className="xl:truncate">
                                {item.value}
                            </span>
                        </li>
                    ))
                }
            </ul>
        </Spring>
    )
}

OrderInfoCard.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
}

export default OrderInfoCard