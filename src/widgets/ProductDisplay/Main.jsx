// components
import Size from '@ui/Size';
import Color from '@ui/Color';
import StarRating from '@ui/StarRating';
import ProgressBar from '@ui/ProgressBar';
import ReviewCard from '@components/ReviewCard';
import ScrollContainer from '@components/ScrollContainer';

// data placeholder
import reviews from '@db/reviews';

const Main = () => {
    return (
        <div>
            <div className="flex flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-col gap-2">
                    <h2>Cotton Rich Jersey Slim Blazer</h2>
                    <span className="font-semibold uppercase text-label dark:text-header">
                        Product ID: GY345912
                    </span>
                </div>
                <button className="text-label font-semibold text-[15px] hover:text-sidebar dark:hover:text-turquoise">
                    <i className="icon-pen-to-square-regular mr-2.5"/>
                    Edit
                </button>
            </div>
            <div className="my-6">
                <p className="uppercase font-bold text-header mb-2.5">
                    Product short description
                </p>
                <p className="text-label max-w-[872px]">
                    Nec ultrices dui sapien eget. Duis ut diam quam nulla porttitor massa id neque aliquam. Condimentum
                    id venenatis a condimentum. Integer feugiat scelerisque varius morbi enim nunc faucibus a pellentesque.
                </p>
            </div>
            <div className="card-container bg-white p-4 rounded-2xl grid grid-cols-1 gap-4 md:p-3 md:grid-cols-4 md:h-[94px]">
                <div className="flex items-center gap-2.5 w-full h-full border-b pb-4 md:pb-0 md:border-b-0 md:border-r
                     md:justify-center">
                    <i className="icon-money-check-dollar-regular text-[24px] text-sidebar dark:text-turquoise -mt-[1px]
                       md:-mt-[22px]"/>
                    <div className="flex flex-col gap-[7px] leading-none">
                        <span className="h2">$120.40</span>
                        <span className="text-label uppercase text-xs font-semibold">
                            Price
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 w-full h-full border-b pb-4 md:pb-0 md:border-b-0 md:border-r
                     md:justify-center">
                    <i className="icon-bags-shopping-regular text-[24px] text-sidebar dark:text-turquoise -mt-[1px]
                       md:-mt-[22px]"/>
                    <div className="flex flex-col gap-[7px] leading-none">
                        <span className="h2">987</span>
                        <span className="text-label uppercase text-xs font-semibold">
                            Orders
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 w-full h-full border-b pb-4 md:pb-0 md:border-b-0 md:border-r
                     md:justify-center">
                    <i className="icon-shop-regular text-[24px] text-sidebar dark:text-turquoise -mt-[1px] md:-mt-[22px]"/>
                    <div className="flex flex-col gap-[7px] leading-none">
                        <span className="h2">104</span>
                        <span className="text-label uppercase text-xs font-semibold">
                            Available Stocks
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 w-full h-full pb-4 md:pb-0 md:justify-center">
                    <i className="icon-wallet-regular text-[24px] text-sidebar dark:text-turquoise -mt-[1px] md:-mt-[22px]"/>
                    <div className="flex flex-col gap-[7px] leading-none">
                        <span className="h2">$12500</span>
                        <span className="text-label uppercase text-xs font-semibold">
                            Total Revenue
                        </span>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-4 my-6 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                    <span className="uppercase font-semibold text-[15px] text-label">
                        Sizes :
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <Size size="xs" name="size"/>
                        <Size size="s"  name="size"/>
                        <Size size="m" name="size"/>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <span className="uppercase font-semibold text-[15px] text-label">
                        Colors :
                    </span>
                    <div className="flex flex-wrap gap-2">
                        <Color color="#469D89" name="color"/>
                        <Color color="#EFD3C0" name="color"/>
                        <Color color="#C5CACE" name="color"/>
                        <Color color="#FE8FD6" name="color"/>
                    </div>
                </div>
            </div>
            <div className="card-container card-container--light rounded-2xl">
                <div className="p-4 border-b">
                    <p className="uppercase font-bold text-header mb-2.5">
                        Product Description
                    </p>
                    <div className="grid grid-cols-1 gap-4 text-label lg:grid-cols-2">
                        <p>
                            Nec ultrices dui sapien eget. Duis ut diam quam nulla porttitor massa id neque aliquam.
                            Condimentum id venenatis a condimentum. Integer feugiat scelerisque varius morbi enim nunc
                            faucibus a pellentesque.
                        </p>
                        <ul>
                            <li>Vestibulum: tristique sollicitudin nibh sit amet</li>
                            <li>Semper: tristique sollicitudin nibh sit amet</li>
                            <li>Consectetur: adipiscing elit duis</li>
                        </ul>
                    </div>
                </div>
                <div className="p-4 border-b">
                    <p className="uppercase font-bold text-header mb-2.5">
                        Additional Information
                    </p>
                    <div className="card-container rounded-2xl text-xs max-w-[470px] dark:!border-border-dark">
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_142px)_minmax(0,_1fr)]">
                            <div className="p-4 border-b font-semibold text-header uppercase md:border-r">
                                Product
                            </div>
                            <div className="p-4 border-b">
                                Cotton Rich Jersey Slim Blazer
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_142px)_minmax(0,_1fr)]">
                            <div className="p-4 border-b font-semibold text-header uppercase md:border-r">
                                Item details
                            </div>
                            <div className="p-4 border-b">
                                Neck to hem length for a size 12: 72cm
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,_142px)_minmax(0,_1fr)]">
                            <div className="p-4 border-b font-semibold text-header uppercase md:border-b-0 md:border-r">
                                Composition
                            </div>
                            <div className="p-4">
                                100% polyester, Lining - 55% polyester, 45% viscose
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <p className="uppercase font-bold text-header mb-2">
                        Ratings & Reviews
                    </p>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h2 w-[70px] h-[54px] flex items-center justify-center bg-turquoise
                                     !text-white rounded-lg">
                                    4.7
                                </div>
                                <div className="flex flex-col gap-2">
                                    <StarRating value={4.7} fontSize={17}/>
                                    <p className="text-xs font-semibold text-label">
                                        Based on 5,438 Ratings
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-4 flex-1">
                                <div className="flex items-center uppercase text-label text-xs font-medium">
                                    <span className="w-[70px]">
                                        5 Stars
                                    </span>
                                    <ProgressBar value={85} color="turquoise" className="dark:bg-widget"/>
                                    <span className="w-[45px] text-right">
                                        3478
                                    </span>
                                </div>
                                <div className="flex items-center uppercase text-label text-xs font-medium">
                                    <span className="w-[70px]">
                                        4 Stars
                                    </span>
                                    <ProgressBar value={70} className="dark:bg-widget"/>
                                    <span className="w-[45px] text-right">
                                        1474
                                    </span>
                                </div>
                                <div className="flex items-center uppercase text-label text-xs font-medium">
                                    <span className="w-[70px]">
                                        3 Stars
                                    </span>
                                    <ProgressBar value={25} color="yellow" className="dark:bg-widget"/>
                                    <span className="w-[45px] text-right">
                                        874
                                    </span>
                                </div>
                                <div className="flex items-center uppercase text-label text-xs font-medium">
                                    <span className="w-[70px]">
                                        2 Stars
                                    </span>
                                    <ProgressBar value={15} color="peach" className="dark:bg-widget"/>
                                    <span className="w-[45px] text-right">
                                        15
                                    </span>
                                </div>
                                <div className="flex items-center uppercase text-label text-xs font-medium">
                                    <span className="w-[70px]">
                                        1 Star
                                    </span>
                                    <ProgressBar value={5} color="red" className="dark:bg-widget"/>
                                    <span className="w-[45px] text-right">
                                        2
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold text-[15px] text-header mb-4">
                                Global reviews (2,123)
                            </p>
                            <div className="h-[193px]">
                                <ScrollContainer heightDeps={0} variant="dark">
                                    <div className="track flex flex-col gap-5">
                                        {
                                            reviews.map((review, index) => (
                                                <ReviewCard key={index} review={review} className="dark:bg-widget"/>
                                            ))
                                        }
                                    </div>
                                </ScrollContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main