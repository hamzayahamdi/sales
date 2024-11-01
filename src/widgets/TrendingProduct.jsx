// components
import Spring from '@components/Spring';
import Trend from '@ui/Trend';
import {NavLink} from 'react-router-dom';

// assets
import bg from '@assets/trending.webp';

const TrendingProduct = () => {
    return (
        <Spring className="card relative h-[392px] p-6 overflow-hidden md:h-full">
            <img className="absolute top-0 left-0 h-full" src={bg} alt="Single Breasted Blazer"/>
            <div className="relative z-10 h-full flex flex-col items-start">
                <h2 className="mb-[18px] text-header-light">
                    Trending now
                </h2>
                <div className="flex items-center justify-center h-9 backdrop-blur-md rounded-xl px-5"
                     style={{background: 'rgba(255, 255, 255, .3)'}}>
                    <Trend labelClass="text-black" value={12} suffix="%"/>
                </div>
                <div className="flex flex-col items-start gap-2.5 mt-auto">
                    <NavLink className="text-header-light font-bold text-[16px] md:text-[18px]" to="/product">
                        Single Breasted Blazer
                    </NavLink>
                    <span className="h3 !text-header-light">
                        $1499.99
                    </span>
                </div>
            </div>
        </Spring>
    )
}

export default TrendingProduct