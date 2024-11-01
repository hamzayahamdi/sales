// components
import Spring from '@components/Spring';

// assets
import bg from '@assets/sale-banner.webp';

const SaleBanner = () => {
    return (
        <Spring className="card p-5 min-h-[180px] h-full relative overflow-hidden xs:p-6">
            <img className="absolute w-full h-full top-0 left-0" src={bg} alt="media"/>
            <div className="flex flex-col gap-4 justify-between relative z-10 xs:flex-row">
                <h2 className="max-w-[180px] leading-[1.125] text-[var(--header-light)]">
                    Sale Designer Brands
                </h2>
                <span className="badge-sale--lg -mt-1 -mr-1">
                    Sale -32%
                </span>
            </div>
        </Spring>
    )
}

export default SaleBanner