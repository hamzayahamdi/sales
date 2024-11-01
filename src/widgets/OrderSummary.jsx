import Spring from '@components/Spring';

const OrderSummary = () => {
    return (
        <Spring className="card flex flex-col justify-between h-full p-5 xs:p-6">
            <h2>Order Summary</h2>
            <ul className="flex flex-1 flex-col gap-4 mt-4 mb-6">
                <li className="flex items-center justify-between pb-[14px] border-b">
                    <span className="uppercase text-label text-xs font-medium">
                        Sub Total :
                    </span>
                    <span className="font-medium">
                        $11488.96
                    </span>
                </li>
                <li className="flex items-center justify-between pb-[14px] border-b">
                    <span className="uppercase text-label text-xs font-medium">
                        Discount :
                    </span>
                    <span className="font-medium">
                        $60.00
                    </span>
                </li>
                <li className="flex items-center justify-between pb-[14px] border-b">
                    <span className="uppercase text-label text-xs font-medium">
                        Shipping Charge :
                    </span>
                    <span className="font-medium">
                        $15.00
                    </span>
                </li>
                <li className="flex items-center justify-between pb-[14px] border-b">
                    <span className="uppercase text-label text-xs font-medium">
                        Estimated Tax :
                    </span>
                    <span className="font-medium">
                        $0.00
                    </span>
                </li>
                <li className="flex items-center justify-between">
                    <span className="uppercase text-label text-xs font-medium">
                        Total (USD) :
                    </span>
                    <span className="font-medium">
                        $1443.96
                    </span>
                </li>
            </ul>
            <form className="flex flex-col gap-2.5 relative">
                <input className="field-input xs:!pr-[112px]"
                       type="text"
                       placeholder="Enter Discount Code"/>
                <button className="btn btn--primary xs:!h-[42px] xs:w-[96px] xs:absolute right-1 top-1/2
                        xs:-translate-y-1/2">
                    Apply
                </button>
            </form>
        </Spring>
    )
}

export default OrderSummary