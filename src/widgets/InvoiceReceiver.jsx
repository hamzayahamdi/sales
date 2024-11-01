import Spring from '@components/Spring';

const InvoiceReceiver = () => {
    return (
        <Spring className="card flex flex-col justify-between !bg-yellow p-5 h-full xs:p-6">
            <h2 className="text-[var(--text-light)] mb-[13px]">
                Invoice to
            </h2>
            <div className="flex flex-col gap-[14px] text-[var(--text-light)] text-[16px] leading-[1.1] font-medium
                 md:text-[18px]">
                <p>Balveer Bhadiar</p>
                <p>25 Melrose Court, Lafayette</p>
                <p>43906  United States</p>
            </div>
        </Spring>
    )
}

export default InvoiceReceiver