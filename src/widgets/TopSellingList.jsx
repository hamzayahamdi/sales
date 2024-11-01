// components
import Spring from '@components/Spring';
import Select from '@ui/Select';
import ScrollContainer from '@components/ScrollContainer';
import TopSellingProductItem from '@components/TopSellingProductItem';

// hooks
import {useState} from 'react';
import useMeasure from 'react-use-measure';
import {useWindowSize} from 'react-use';

// utils
import classNames from 'classnames';

// constants
import {PERIODS} from '@constants/options';

// data placeholder
import products from '@db/products';

const TopSellingList = () => {
    const {width} = useWindowSize();
    const [period, setPeriod] = useState(PERIODS[0]);
    const [headerRef, {height}] = useMeasure();

    const data = products.slice(0, 10);

    return (
        <Spring className="card h-[604px] overflow-hidden md:h-full">
            <div className="flex flex-col gap-2.5 p-5 !pb-5 xs:p-6 xs:flex-row xs:items-center xs:justify-between
                 md:flex-col md:items-stretch lg:flex-row lg:items-center"
                 ref={headerRef}>
                <h2>
                    <span className="xl:hidden 4xl:inline">
                        Top Selling Products
                    </span>
                    <span className="hidden xl:inline 4xl:hidden">
                        Bestsellers
                    </span>
                </h2>
                <div className="lg:min-w-[105px]">
                    <Select variant="minimal"
                            options={PERIODS}
                            value={period}
                            onChange={setPeriod}/>
                </div>
            </div>
            <ScrollContainer heightDeps={height}>
                <div className="track flex flex-col gap-4 px-5 !pt-0 !pb-4 xs:p-6">
                    {
                        data.map((product, index) => (
                            <Spring className={classNames(
                                'flex items-center justify-between gap-4',
                                index !== data.length - 1 && 'border-b pb-4'
                            )}
                                    key={`${product.id}-${period.value}`}
                                    type="slideUp"
                                    index={index}>
                                <TopSellingProductItem
                                    product={product}
                                    imgSize={width < 768 ? 40 : 60}
                                    titleClass="truncate w-[110px] xs:w-[200px] xl:w-[150px] 3xl:w-[200px]"
                                    subtitleClass="truncate w-[110px] xs:w-[200px] xl:w-[150px] 3xl:w-[200px]"
                                />
                                <span className="font-semibold text-[15px] text-header">
                                    ${product.price}
                                </span>
                            </Spring>
                        ))
                    }
                </div>
            </ScrollContainer>
        </Spring>
    )
}

export default TopSellingList