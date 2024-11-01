// components
import {NavLink} from 'react-router-dom';
import {ReactComponent as LogoIcon} from '@assets/logo-icon.svg';
import {ReactComponent as LogoText} from '@assets/logo-text.svg';

const Logo = () => {
    return (
        <NavLink className="inline-flex items-center gap-1.5" to="/" aria-label="Comvi">
            <LogoIcon/>
            <LogoText className="text-white dark:text-[#EBF0ED]"/>
        </NavLink>
    )
}

export default Logo