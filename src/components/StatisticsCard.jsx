// components
import Counter from '@components/Counter';
import { IconContext } from 'react-icons';

const StatisticsCard = ({ data }) => {
    const isPrimary = data.isPrimary;

    return (
        <div className={`flex flex-col gap-4 p-5 bg-white shadow-lg rounded-xl w-full relative overflow-hidden
            ${isPrimary ? 'min-h-[160px]' : 'min-h-[120px]'}`}
        >
            {/* Background gradient effect - different for primary stats */}
            <div className={`absolute inset-0 bg-gradient-to-br 
                ${isPrimary ? 'from-[#599AED]/10 to-transparent' : 'from-[#599AED]/5 to-transparent'}`}
            />
            
            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center rounded-xl shadow-lg shadow-[#599AED]/20
                        ${isPrimary ? 'w-12 h-12 bg-[#599AED]' : 'w-10 h-10 bg-[#599AED]/90'}`}
                    >
                        <data.icon className={`${isPrimary ? 'w-6 h-6' : 'w-4 h-4'} text-white`} />
                    </div>
                    <h3 className={`font-medium text-gray-600 uppercase tracking-wide
                        ${isPrimary ? 'text-sm' : 'text-xs'}`}
                    >
                        {data.title}
                    </h3>
                </div>

                {/* Value */}
                <div className="flex items-baseline gap-2">
                    <span className={`font-bold text-gray-900 ${data.valueClass || 'text-2xl'}`}>
                        <Counter 
                            value={data.value} 
                            duration={1}
                            formatValue={(value) => new Intl.NumberFormat('fr-FR').format(value)}
                        />
                    </span>
                    <span className={`font-medium text-[#599AED] ${data.prefixClass || 'text-base'}`}>
                        {data.valuePrefix}
                    </span>
                </div>
            </div>

            {/* Decorative elements - only for primary stats */}
            {isPrimary && (
                <>
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#599AED]/5 rounded-full blur-2xl"></div>
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#599AED]/3 rounded-full blur-xl"></div>
                </>
            )}
        </div>
    );
};

export default StatisticsCard;