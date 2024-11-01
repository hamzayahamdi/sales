import Spring from '@components/Spring';

const OrderComment = () => {
    return (
        <Spring className="card flex flex-col gap-2 p-5 h-[180px] xs:p-6">
            <label className="h3" htmlFor="orderComment">
                Comment
            </label>
            <textarea className="field-input !h-full !py-[14px]"
                      id="orderComment"
                      placeholder="Add a Note:  This is a small notes section that only the seller can see."/>
        </Spring>
    )
}

export default OrderComment