// components
import Spring from '@components/Spring';
import EditButton from '@ui/EditButton';
import SimpleTable from '@components/SimpleTable';
import OrderTableItem from '@components/OrderTableItem';

// hooks
import {useWindowSize} from 'react-use';

// constants
import {ORDER_COLUMN_DEFS} from '@constants/columnDefs';

// data placeholder
import order from '@db/order';

const InvoiceDetails = () => {
    const {width} = useWindowSize();

    return (
        <Spring className="card h-full">
            <div className="flex items-center justify-between p-5 !pb-[16px] xs:p-6">
                <h2>Item Detail</h2>
                <EditButton/>
            </div>
            <div className="border-t border-b">
                {
                    width < 768 ?
                        <div>
                            {
                                order.map((item, index) => (
                                    <OrderTableItem product={item} isLast={index === order.length - 1} key={index}/>
                                ))
                            }
                        </div>
                        :
                        <SimpleTable dataSource={order}
                                     columns={ORDER_COLUMN_DEFS}
                                     pagination={false}
                                     scroll={{y: 266}}
                                     showSorterTooltip={false}
                        />
                }
            </div>
            <div className="p-5 !pt-0 xs:p-6 mt-6 md:mt-8">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="flex flex-col gap-2">
                        <label className="h2" htmlFor="invoiceComment">
                            Comment
                        </label>
                        <textarea className="field-input !py-[14px] !h-[144px]"
                                  id="invoiceComment"
                                  placeholder="Add a Note:  This is a small notes section that only the seller can see."/>
                    </div>
                    <div className="flex flex-col gap-10">
                        <ul className="card-container rounded-[10px] font-medium p-4 flex flex-col gap-[14px]">
                            <li className="flex items-center justify-between">
                            <span className="uppercase text-xs text-label">
                                Sub Total :
                            </span>
                                <span>
                                $683.17
                            </span>
                            </li>
                            <li className="flex items-center justify-between">
                            <span className="uppercase text-xs text-label">
                                Discount :
                            </span>
                                <span>
                                $60.00
                            </span>
                            </li>
                            <li className="flex items-center justify-between">
                            <span className="uppercase text-xs text-label">
                                Shipping Charge :
                            </span>
                                <span>
                                $15.00
                            </span>
                            </li>
                            <li className="flex items-center justify-between">
                            <span className="uppercase text-xs text-label">
                                Estimated Tax :
                            </span>
                                <span>
                                $0.00
                            </span>
                            </li>
                            <li className="flex items-center justify-between font-bold text-header">
                            <span className="uppercase">
                                Total (USD) :
                            </span>
                                <span>
                                $638.17
                            </span>
                            </li>
                        </ul>
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-6">
                            <button className="btn btn--base h-[50px]">
                                Share
                            </button>
                            <button className="btn btn--primary">
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Spring>
    )
}

export default InvoiceDetails