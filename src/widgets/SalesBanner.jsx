// components
import Spring from '@components/Spring';

// assets
import img from '@assets/midaxi.webp';

const SalesBanner = () => {
    return (
        <Spring className="card min-h-[392px] p-5 relative overflow-hidden xs:p-6">
            <div className="flex gap-4 justify-between relative z-10">
                <h2 className="max-w-[155px] leading-[1.125]" style={{color: 'var(--text-light)'}}>
                    Floral Midaxi Tea Dresses
                </h2>
                <span className="badge-sale--lg">
                    Sale -32%
                </span>
            </div>
            <img className="absolute w-full h-full top-0 left-0"
                 src={img}
                 alt="Floral Midaxi Tea Dresses"/>
        </Spring>
    )
}

export default SalesBanner