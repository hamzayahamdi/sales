// hooks
import {useTheme} from '@contexts/themeContext';

// assets
import image from '@assets/sidebar-banner.svg';

const SidebarBanner = ({wrapperClass}) => {
    const {theme} = useTheme();

    return (
            <div className={`relative overflow-hidden h-[270px] flex flex-col justify-between p-6 rounded-[20px] shrink-0 ${wrapperClass || ''}`}
                 style={{background: `var(--linear-green-${theme})`}}>
            <h2 className="relative z-10 text-white max-w-[200px] leading-[1.125]">
                Improve Your Sales Efficiency
            </h2>
            <img className="absolute -left-3.5 -bottom-8" src={image} alt="media" />
            <button className="relative z-10 bg-yellow h-10 rounded-[10px] text-[15px] font-semibold
                    will-change-transform transition-transform hover:scale-95"
                    style={{color: 'var(--header-light)'}}>
                Start Now
            </button>
        </div>
    )
}

export default SidebarBanner