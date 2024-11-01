import PropTypes from 'prop-types';

const ChartLegend = ({ color, label }) => {
    return (
        <div className="flex items-center gap-2 font-medium text-[15px] text-header leading-none">
            <span className="w-3 h-3 rounded" style={{background: color}}/>
            {label}
        </div>
    )
}

ChartLegend.propTypes = {
    color: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
}

export default ChartLegend