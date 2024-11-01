// components
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Logo from '@components/Logo';
import SidebarBanner from '@components/SidebarBanner';
import {NavLink} from 'react-router-dom';
import Collapse from '@mui/material/Collapse';
import {Fragment} from 'react';

// hooks
import {useSidebar} from '@contexts/sidebarContext';
import {useWindowSize} from 'react-use';
import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import {useTheme} from '@contexts/themeContext';

// constants
import ROUTES from '@constants/routes';

const Icon = ({route}) => {
    return (
        <span className="nav-icon relative w-[18px]">
              <i className={`icon icon-${route.icon}-regular`}/>
              <i className={`icon icon--active icon-${route.icon}-solid`}/>
            {
                route.notifications &&
                <span className="badge">
                    <span className="-mt-[1px]">
                        {route.notifications}
                    </span>
                </span>
            }
        </span>
    )
}

const Sidebar = () => {
    const {theme} = useTheme();
    const location = useLocation();
    const {width} = useWindowSize();
    const {open, setOpen} = useSidebar();
    const [activeCollapse, setActiveCollapse] = useState('');

    const handleCollapse = (name) => {
        activeCollapse === name ? setActiveCollapse('') : setActiveCollapse(name);
    }

    useEffect(() => {
        ROUTES.main.forEach((route) => {
            if (route.links) {
                route.links.forEach((link) => {
                    if (location.pathname === link.path) {
                        setActiveCollapse(route.name);
                    }
                })
            }
        });

    }, [location.pathname]);

    return (
        <SwipeableDrawer open={open}
                         onClose={() => setOpen(false)}
                         onOpen={() => setOpen(true)}
                         variant={width >= 1920 ? 'permanent' : 'temporary'}
                         classes={{
                             paper: 'p-6'
                         }}
                         sx={{
                             '& .MuiDrawer-paper': {
                                 backgroundColor: 'var(--sidebar)',
                                 borderRight: 'none',
                                 boxShadow: 'none',
                                 width: width < 414 ? '100%' : 296
                             },
                             '& .MuiModal-backdrop': {
                                    backgroundColor: theme === 'light' ? 'transparent' : 'rgba(0, 0, 0, .8)'
                             }
                         }}>
            <div className="flex items-center justify-between">
                <Logo/>
                <button className="text-[24px] text-white xs:hidden"
                        aria-label="Close menu"
                        onClick={() => setOpen(false)}>
                    <i className="icon-xmark-regular"/>
                </button>
            </div>
            <div className="mt-8 mb-10">
                <span className="block mb-6 uppercase font-semibold text-sm text-[#AFC6C4]">
                    Menu
                </span>
                <div className="flex flex-col gap-8">
                    {
                        ROUTES.main.map((route) => {
                            const hasSubRoutes = route.links && route.links.length > 0;

                            return (
                                <Fragment key={route.name}>
                                    {
                                        hasSubRoutes ? (
                                            <div>
                                                <div className={`nav-item w-full flex items-center ${activeCollapse === route.name ? 'active' : ''}`}>
                                                    <Icon route={route}/>
                                                    <span className="text" onClick={() => handleCollapse(route.name)}>
                                                        {route.name}
                                                    </span>
                                                    <button className={`ml-auto ${activeCollapse === route.name ? 'expanded' : ''}`}
                                                            aria-label={activeCollapse === route.name ? 'Collapse' : 'Expand'}
                                                            onClick={() => handleCollapse(route.name)}>
                                                        <i className="icon-chevron-down-regular"/>
                                                    </button>
                                                </div>
                                                <Collapse in={activeCollapse === route.name}
                                                            timeout={300}>
                                                    <div className="flex flex-col gap-4 mt-4">
                                                        {
                                                            route.links.map((link, index) => (
                                                                <NavLink key={index}
                                                                         to={link.path}
                                                                         className="nav-item submenu-item">
                                                                    <span className="text">{link.name}</span>
                                                                </NavLink>
                                                            ))
                                                        }
                                                    </div>
                                                </Collapse>
                                            </div>
                                        ) : (
                                            <NavLink to={route.path} className="nav-item">
                                                <Icon route={route}/>
                                                <span className="text">{route.name}</span>
                                            </NavLink>
                                        )
                                    }
                                </Fragment>
                            )
                        })
                    }
                </div>
            </div>
            <span className="w-full h-[1px] bg-[#578787] shrink-0"/>
            <div className="mb-10 mt-10">
                <span className="block mb-6 uppercase font-semibold text-sm text-[#AFC6C4]">
                    Other
                </span>
                <div className="flex flex-col items-start gap-8">
                    {
                        ROUTES.secondary.map((route) => (
                            <NavLink key={route.name}
                                     to={route.path}
                                     className="nav-item">
                                <span className="nav-icon relative w-[18px]">
                                    <i className={`icon icon-${route.icon}-regular`}/>
                                    <i className={`icon icon--active icon-${route.icon}-solid`}/>
                                </span>
                                <span className="text">{route.name}</span>
                            </NavLink>
                        ))
                    }
                </div>
            </div>
            <SidebarBanner wrapperClass="hidden mt-auto 4xl:flex"/>
        </SwipeableDrawer>
    )
}

export default Sidebar