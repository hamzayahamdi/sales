// components
import TopSellingProductItem from '@components/TopSellingProductItem';
import QtyInput from '@ui/QtyInput';

// data placeholder
import top_selling from '@db/top_selling';

const ShoppingCart = () => {
    const data  = top_selling.slice(0, 3);

    return (
        <div className="flex flex-col gap-5 bg-widget w-[288px] h-[560px] rounded-3xl border shadow-lg xs:w-[360px]">
            <h2 className="flex items-center gap-2 p-5 !pb-0 xs:p-6">
                Shopping Cart
                {
                    data.length > 0 && (
                        <span className="bg-red w-6 h-6 rounded-full flex items-center justify-center text-white text-sm">
                              {data.length}
                        </span>
                    )
                }
            </h2>
            <div className="flex flex-col flex-1 gap-4">
                <div className="flex flex-col flex-1 gap-4 max-h-[347px] overflow-y-auto with-scrollbar px-5 xs:px-6">
                    {
                        data.map((product) => (
                            <div key={product.id} className="pb-4 border-b">
                                <div className="flex justify-between items-start gap-4">
                                    <TopSellingProductItem product={product}
                                                           imgSize={48}
                                                           subtitleClass="truncate max-w-[130px] xs:max-w-[210px]"
                                                           titleClass="truncate max-w-[130px] xs:max-w-[210px]"/>
                                    <button className="text-base text-red shrink-0" aria-label="Delete">
                                        <i className="icon-xmark-regular"/>
                                    </button>
                                </div>
                                <div className="flex justify-between items-center ml-[64px] mt-1">
                                    <QtyInput/>
                                    <span className="text-header font-semibold text-[15px]">
                                        ${(product.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="flex flex-col gap-6 p-5 !pt-0 xs:p-6">
                    <div className="flex justify-between items-center">
                        <span className="text-label text-xs font-bold uppercase">Total:</span>
                        <span className="text-sm text-header font-bold">$1443.96</span>
                    </div>
                    <button className="btn btn--primary w-full">Checkout</button>
                </div>
            </div>
        </div>
    )
}

export default ShoppingCart