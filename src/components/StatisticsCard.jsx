// components
import Counter from '@components/Counter';
import { IconContext } from 'react-icons';

const StatisticsCard = ({ data }) => {
    return (
        <div className={`flex flex-col gap-4 p-4 bg-white shadow-lg rounded-xl w-full`}>
            <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg bg-[#F3F3F8] shadow-sm`}>
                    <data.icon className="w-4 h-4 text-[#599AED]" />
                </span>
                <h3 className="text-xs font-medium text-gray-600 uppercase">{data.title}</h3>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`font-bold text-gray-900 ${data.valueClass || 'text-xl'}`}>
                    <Counter 
                        value={data.value} 
                        duration={1}
                        formatValue={(value) => new Intl.NumberFormat('fr-FR').format(value)}
                    />
                </span>
                <span className={`font-medium text-gray-500 ${data.prefixClass || 'text-xs'}`}>
                    {data.valuePrefix}
                </span>
            </div>
        </div>
    );
};

export default StatisticsCard;