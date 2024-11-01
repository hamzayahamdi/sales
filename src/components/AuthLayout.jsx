// components
import Spring from '@components/Spring';
import {Helmet} from 'react-helmet';
import {ReactComponent as LogoIconDark} from '@assets/logo-alt-dark.svg';
import {ReactComponent as LogoIconLight} from '@assets/logo-alt-light.svg';

// utils
import PropTypes from 'prop-types';

const AuthLayout = ({title, children}) => {
    return (
        <>
            <Helmet>
                <title>{title} | Comvi React Ecommerce Dashboard Template</title>
            </Helmet>
            <div className="flex flex-col flex-1 justify-center items-center">
                <Spring className="bg-widget rounded-[20px] w-full p-5 xs:p-6 md:p-20" type="slideUp">
                    <div className="flex flex-col items-center text-center mb-6">
                        <LogoIconLight className="w-[70px] h-[70px] dark:hidden"/>
                        <LogoIconDark className="w-[70px] h-[70px] hidden dark:block"/>
                        <h1 className="mt-4 mb-2">{title}</h1>
                        <p className="max-w-[220px] text-label">
                            Improve business performance with Comvi dashboards
                        </p>
                    </div>
                    {children}
                </Spring>
            </div>
        </>
    )
}

AuthLayout.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string.isRequired
}

export default AuthLayout