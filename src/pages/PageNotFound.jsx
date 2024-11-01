import AppBar from '@components/AppBar';
import {NavLink} from 'react-router-dom';
import img from '@assets/404.svg';

const PageNotFound = () => {
    return (
        <>
            <AppBar title="Page not found" />
            <div className="layout-wrapper flex flex-1 h-full">
                <div className="card flex flex-col items-center justify-center flex-1 p-6 md:p-10 xl:flex-row
                 xl:p-10 xl:pb-0 xl:justify-start">
                    <img className="hidden xl:block max-w-[600px] mt-auto 4xl:max-w-[826px]" src={img} alt="404"/>
                    <div className="flex flex-col items-center text-center xl:ml-[94px]">
                    <span className="font-bold text-[72px] leading-none text-[#578787] dark:text-turquoise
                          md:text-[212px] md:leading-[1.1]">
                        404
                    </span>
                        <p className="font-bold text-header text-[18px] mt-10 mb-8 max-w-[240px] md:text-[32px]
                       md:max-w-[500px] md:mt-[3px] md:mb-[56px]">
                            Sorry, You Are Not Allowed to Access This Page
                        </p>
                        <NavLink to="/" className="btn btn--primary w-[155px]">Go to Home</NavLink>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PageNotFound