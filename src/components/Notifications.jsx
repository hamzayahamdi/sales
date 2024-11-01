// components
import IconButton from '@ui/IconButton';
import BasicCheckbox from '@ui/BasicCheckbox';
import Gallery from '@components/Gallery';
import Spring from '@components/Spring';

// utils
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {faker} from '@faker-js/faker';
import classNames from 'classnames';

// assets
import img1 from '@assets/products/1.webp';
import img2 from '@assets/products/2.webp';
import img3 from '@assets/products/3.webp';

dayjs.extend(relativeTime);

const placeholder = [
    {
        id: 'notification-1',
        read: false,
        date: dayjs().subtract(4, 'minute'),
        title: 'New Order #AN230965',
        type: 'order',
        customer: 'John Doe',
        amount: 1200
    },
    {
        id: 'notification-2',
        read: false,
        date: dayjs().subtract(20, 'minute'),
        title: 'New Review to Product',
        type: 'review',
        preview: faker.lorem.paragraph(),
        media: [
            {
                src: img1,
                alt: 'review image'
            },
            {
                src: img2,
                alt: 'review image'
            },
            {
                src: img3,
                alt: 'review image'
            }
        ]
    },
    {
        id: 'notification-3',
        read: true,
        date: dayjs().subtract(3, 'day'),
        title: 'New Order #TK071055',
        type: 'order',
        customer: 'Sally Maison',
        amount: 2894.95
    },
    {
        id: 'notification-4',
        read: true,
        date: dayjs().subtract(5, 'day').subtract(2, 'hour'),
        title: 'New Order #BD589741',
        type: 'order',
        customer: 'Rita Leblanc',
        amount: 9874.98
    }
]

const Notification = ({data, index}) => {
    return (
        <Spring className={classNames('', {'border-b pb-4': index !== placeholder.length - 1})}
                type="slideUp"
                index={index}>
            <p className="flex items-center gap-4 mb-2">
                {
                    data.read ? (
                        <>
                            <span className="uppercase text-label text-[14px] font-semibold">
                                {dayjs(data.date).format('MMM, DD YYYY')}
                            </span>
                            <span className="text-label">
                                 {dayjs(data.date).format('[at] hh:mm A')}
                            </span>
                        </>
                    ) : (
                        <>
                            <span className="uppercase text-turquoise text-[14px] font-semibold">
                                New
                            </span>
                            <span className="text-label text-xs font-medium">
                                {dayjs(data.date).fromNow()}
                            </span>
                        </>
                    )
                }
            </p>
            <div className="flex justify-between text-label gap-4">
                <div>
                    <p className="text-header text-[15px] font-semibold mb-1">
                        {data.title}
                    </p>
                    {
                        data.type === 'order' ? (
                            <div className="flex flex-col gap-1 text-xs">
                                <p>Customer: {data.customer}</p>
                                <p>Amount: ${(data.amount).toFixed(2)}</p>
                            </div>
                        ) : null
                    }
                    {
                        data.type === 'review' ? (
                            <div className="flex flex-col gap-2 items-start text-xs">
                                <p className="max-w-[311px]">{data.preview}</p>
                                {
                                    data.media.length > 0 && (
                                        <Gallery images={data.media}/>
                                    )
                                }
                            </div>
                        ) : null
                    }
                </div>
                <BasicCheckbox id={data.id} labelClass="!border-border !bg-[var(--header-dark)] dark:!bg-widget"/>
            </div>
        </Spring>
    )
}

const Notifications = () => {
    const unreadNotifications = placeholder.filter(notification => !notification.read);

    return (
        <div className="flex flex-col gap-5 bg-widget w-[288px] h-[475px] rounded-3xl border shadow-lg xs:w-[360px]">
            <div className="flex items-center justify-between p-5 !pb-0 xs:p-6">
                <h2 className="flex items-center gap-2">
                    Notifications
                    {
                        unreadNotifications.length > 0 && (
                            <span className="bg-red w-6 h-6 rounded-full flex items-center justify-center text-white text-sm">
                                <span className="-mt-[1px]">
                                    {unreadNotifications.length}
                                </span>
                            </span>
                        )
                    }
                </h2>
                <IconButton/>
            </div>
            <div className="overflow-y-auto with-scrollbar">
                <div className="flex flex-col flex-1 gap-4 p-5 !pt-0 xs:p-6">
                    {
                        placeholder.map((notification, index) => (
                            <Notification key={notification.id}
                                          data={notification}
                                          index={index}/>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Notifications