// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import OfferCard from '@components/OfferCard';

// hooks
import useDraggableScrollContainer from '@hooks/useDraggableScrollContainer';
import {useEffect, useState} from 'react';

// constants
import {PERIODS} from '@constants/options';

// data placeholder
import products from '@db/products';

const PeriodBestSellers = () => {
    const [period, setPeriod] = useState(PERIODS[0]);
    const {containerRef, isDragging} = useDraggableScrollContainer();
    const data = products.slice(0, 10);

    useEffect(() => {
        containerRef.current && containerRef.current.scrollTo({
            left: 0,
            behavior: 'smooth'
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    return (
        <Spring className="card flex flex-col justify-between h-full">
            <div className="flex items-center justify-between gap-3 p-5 !pb-3 xs:p-6">
                <h2>Best Selling <span className="hidden md:inline">Products</span></h2>
                <div className="min-w-[105px]">
                    <Select value={period} onChange={setPeriod} options={PERIODS} />
                </div>
            </div>
            <div className={`draggable-container flex gap-4 p-5 !pt-0 xs:p-6 ${isDragging ? 'isDragging' : ''}`}
                 ref={containerRef}>
                {
                    data.map((item, index) => (
                        <OfferCard product={item}
                                   index={index}
                                   key={`${period.value}-${index}`} />
                    ))
                }
            </div>
        </Spring>
    )
}

export default PeriodBestSellers