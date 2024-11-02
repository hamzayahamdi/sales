// components
import Counter from '@components/Counter';
import { IconContext } from 'react-icons';

const StatisticsCard = ({ data }) => {
    return (
        <div className={`flex flex-col gap-4 p-4 ${data.bgColor} shadow-[0_4px_25px_0_rgba(0,0,0,0.3)] rounded-xl w-full`}>
            <div className="flex items-center gap-3">
                <span className={`flex items-center justify-center w-10 h-10 rounded-lg ${data.iconBgColor} shadow-[0_4px_15px_0_rgba(0,0,0,0.2)]`}>
                    <data.icon className="w-4 h-4 text-[#60A5FA]" />
                </span>
                <h3 className="text-xs font-medium text-gray-300 uppercase">{data.title}</h3>
            </div>
            <div className="flex items-baseline gap-1">
                <span className={`font-bold text-white ${data.valueClass || 'text-xl'}`}>
                    <Counter 
                        value={data.value} 
                        duration={1}
                        formatValue={(value) => new Intl.NumberFormat('fr-FR').format(value)}
                    />
                </span>
                <span className={`font-medium text-gray-400 ${data.prefixClass || 'text-xs'}`}>
                    {data.valuePrefix}
                </span>
            </div>
        </div>
    );
};

export default StatisticsCard;