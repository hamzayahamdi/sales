// components
import TopSellingProductItem from '@components/TopSellingProductItem';
import StarRating from '@ui/StarRating';
import IconButton from '@ui/IconButton';
import StatusBadge from '@ui/StatusBadge';

// utils
import {commaFormatter, addZero} from '@utils/helpers';
import dayjs from 'dayjs';

export const TOP_SELLING_COLUMN_DEFS = [
    {
        title: 'Product name',
        dataIndex: 'product',
        render: (text, record) => <TopSellingProductItem product={record} imgSize={40}/>,
        width: 280
    },
    {
        title: 'Price',
        dataIndex: 'price',
        render: text => <span>${text}</span>,
        sorter: (a, b) => a.price - b.price
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: text => <StatusBadge status={text} type="product"/>,
        responsive: ['xxl']
    },
    {
        title: 'Sold',
        dataIndex: 'sold',
        render: text => <span>{text} pcs</span>,
        sorter: (a, b) => a.sold - b.sold,
        responsive: ['lg']
    },
    {
        title: 'Total earning',
        dataIndex: 'earned',
        render: (text, record) => (
            <span>${commaFormatter(record.price * record.sold, 2)}</span>
        ),
        sorter: (a, b) => a.price * a.sold - b.price * b.sold
    }
]

export const ORDER_COLUMN_DEFS = [
    {
        title: 'Product',
        dataIndex: 'product',
        render: (text, record) => <TopSellingProductItem product={record} imgSize={56}/>,
        width: 305
    },
    {
        title: 'Price',
        dataIndex: 'price',
        render: text => <span>${text}</span>,
        sorter: (a, b) => a.price - b.price
    },
    {
        title: 'Quantity',
        dataIndex: 'qty',
        render: text => <span>{addZero(text)}</span>
    },
    {
        title: 'Total',
        dataIndex: 'total',
        render: (text, record) => (
            <span>${commaFormatter(record.price * record.qty, 2)}</span>
        ),
        sorter: (a, b) => a.price * a.qty - b.price * b.qty
    }
]

export const REVIEW_COLUMN_DEFS = [
    {
        title: 'Status',
        dataIndex: 'status',
        render: text => (
            <span className="font-semibold text-header text-[15px] capitalize">
                {text}
            </span>
        ),
        responsive: ['xl']
    },
    {
        title: 'Product',
        dataIndex: 'product',
        render: (text, record) => <TopSellingProductItem product={record.product} imgSize={40} withCategory/>,
        sorter: (a, b) => a.product.name.localeCompare(b.product.name)
    },
    {
        title: 'Rating',
        dataIndex: 'rating',
        render: text => <StarRating value={text} fontSize={14}/>,
        responsive: ['lg'],
        sorter: (a, b) => a.rating - b.rating
    },
    {
        title: 'Review',
        dataIndex: 'review',
        width: 180,
        render: text => (
            <p className="text-xs truncate max-w-[180px] text-label dark:text-[var(--border-light)] 4xl:max-w-[260px]">
                {text}
            </p>
        )
    },
    {
        title: 'Author',
        dataIndex: 'author',
        render: (text, record) => (
            <span className="font-medium text-header text-[15px]">
                {record.user.firstName} {record.user.lastName}
            </span>
        ),
        responsive: ['xl'],
        sorter: (a, b) => a.user.lastName.localeCompare(b.user.lastName)
    },
    {
        title: 'Submitted on',
        dataIndex: 'date',
        render: text => (
            <span className="text-label">
                {dayjs(text).format('MMM DD, YYYY - hh:mm A')}
            </span>
        ),
        sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    }
]

export const ORDERS_COLUMN_DEFS = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        render: text => <span>#{text}</span>
    },
    {
        title: 'Customer',
        render: (text, record) => <span>{record.user.firstName} {record.user.lastName}</span>,
        sorter: (a, b) => a.user.lastName.localeCompare(b.user.lastName),
        responsive: ['lg']
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        render: text => <span>${text}</span>,
        sorter: (a, b) => a.amount - b.amount
    },
    {
        title: 'Payment method',
        dataIndex: 'method',
        render: text => <span>{text}</span>,
        responsive: ['xl']
    },
    {
        title: 'Order date',
        dataIndex: 'date',
        render: text => <span>{dayjs(text).format('MMM DD, YYYY')}</span>,
        sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: text => <StatusBadge status={text}/>
    },
    {
        title: '',
        width: 36,
        render: () => <IconButton className="dark:bg-widget"/>
    }
]

export const ORDER_STATUS_COLUMN_DEFS = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        render: text => (
            <span className="text-sidebar font-semibold dark:text-turquoise">
                #{text}
            </span>
        )
    },
    {
        title: 'Date',
        dataIndex: 'date',
        render: text => (
            <span className="font-medium">
                {dayjs(text).format('MMM DD, YYYY')}
            </span>
        ),
        sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: text => <StatusBadge status={text}/>,
        className: '3xl:!pl-2 4xl:!pl-6',
    }
]

export const ORDERS_WIDGET_COLUMN_DEFS = [
    {
        title: 'Order ID',
        dataIndex: 'id',
        render: text => <span>#{text}</span>
    },
    {
        title: 'Customer',
        render: (text, record) => <span>{record.user.firstName} {record.user.lastName}</span>,
        sorter: (a, b) => a.user.lastName.localeCompare(b.user.lastName),
        responsive: ['xxl']
    },
    {
        title: 'Amount',
        dataIndex: 'amount',
        render: text => <span>${text}</span>,
        sorter: (a, b) => a.amount - b.amount
    },
    {
        title: 'Payment method',
        dataIndex: 'method',
        render: text => <span>{text}</span>,
        responsive: ['xl']
    },
    {
        title: 'Order date',
        dataIndex: 'date',
        render: text => <span>{dayjs(text).format('MMM DD, YYYY')}</span>,
        sorter: (a, b) => dayjs(a.date).unix() - dayjs(b.date).unix()
    },
    {
        title: 'Status',
        dataIndex: 'status',
        render: text => <StatusBadge status={text}/>
    }
]