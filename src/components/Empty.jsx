// components
import Spring from '@components/Spring';

// hooks
import {useTheme} from '@contexts/themeContext';

// assets
import light from '@assets/empty_light.svg';
import dark from '@assets/empty_dark.svg';

const Empty = ({text = 'Nothing found'}) => {
    const {theme} = useTheme();

    return (
        <Spring className="flex flex-1 flex-col items-center justify-center gap-3" type="slideUp">
            <img className="max-w-[180px]"
                 src={theme === 'light' ? light : dark}
                 alt="Empty"/>
            <p className="text-xs text-label">{text}</p>
        </Spring>
    )
}

export default Empty