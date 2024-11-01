// components
import Spring from '@components/Spring';
import QRCode from 'react-qr-code';

// hooks
import {useWindowSize} from 'react-use';

// utils
import dayjs from 'dayjs';

const data = {
    invoiceNumber: '642678',
    issuedDate: new Date(2023, 2, 28),
    dueDate: new Date(2023, 3, 2),
    link: 'https://1.envato.market/tf-merkulove'
}

const InvoiceInfo = ({info = data}) => {
    const {width} = useWindowSize();

    return (
        <Spring className="card flex flex-col md:flex-row md:justify-between md:items-center gap-6 !bg-blue p-5 h-full xs:p-6">
            <div className="text-[var(--header-light)]">
                <h2 className="mb-[15px] text-[var(--header-light)]">
                    Invoice Number
                </h2>
                <ul className="flex flex-col gap-[14px] text-[16px] leading-[1.1] font-medium md:text-[18px]">
                    <li>No : #{info.invoiceNumber}</li>
                    <li>Issued Date: {dayjs(info.issuedDate).format('MMM DD, YYYY')}</li>
                    <li>Due Date : {dayjs(info.dueDate).format('MMM DD, YYYY')}</li>
                </ul>
            </div>
            <div className="md:w-[132px]">
                <QRCode value={info.link}
                        bgColor="transparent"
                        fgColor="var(--header-light)"
                        style={{ height: 'auto', width: width < 768 ? '60%' : '100%' }}/>
            </div>
        </Spring>
    )
}

export default InvoiceInfo