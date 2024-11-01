// components
import Spring from '@components/Spring';

// utils
import dayjs from 'dayjs';
import classNames from 'classnames';

const LoginHistoryItem = ({data, index, isFirstChild, isLastChild}) => {
    return (
        <Spring className={classNames('flex items-center justify-between',
                {'border-b pb-4': !isLastChild},
                {'pt-4': !isFirstChild}
            )}
                type="slideUp"
                index={index}>
            <div className="flex items-center gap-4">
                <div className="w-[60px] h-[60px] hidden xs:flex md:hidden lg:flex items-center justify-center btn--base
                     rounded-[10px]">
                    <i className={`icon-${data.device}-regular -mt-[1px] text-2xl text-sidebar dark:text-turquoise`}/>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[15px] text-header font-semibold">{data.title}</span>
                    <span className="text-label">
                        {dayjs(data.timestamp).format('MMM DD, YYYY [at] hh:mm A')}
                    </span>
                </div>
            </div>
            <button className="font-semibold text-[15px] text-peach dark:text-turquoise">
                Logout
            </button>
        </Spring>
    )
}

export default LoginHistoryItem