// components
import Spring from '@components/Spring';
import Switch from '@ui/Switch';

const SendInvoice = () => {
    const messagePlaceholder = 'Thank you for your order! Payment is expected within 31 day. Please process this invoice within that time.';

    return (
        <Spring className="card flex flex-col gap-2 p-5 h-full xs:p-6">
            <h2 className="leading-none">Send Invoice</h2>
            <div className="flex flex-col flex-1">
                <textarea className="field-input !min-h-[240px] flex-1 !py-[14px] md:!min-h-[108px]"
                          defaultValue={messagePlaceholder}
                          placeholder="Enter invoice message"/>
                <div className="flex items-center justify-between mt-[18px] mb-[26px]">
                    <p className="text-header font-medium text-[15px]">
                        Attach PDF
                    </p>
                    <Switch id="attach-pdf" />
                </div>
                <button className="btn btn--primary w-full">
                    Send Invoice
                </button>
            </div>
        </Spring>
    )
}

export default SendInvoice