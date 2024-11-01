// components
import Spring from '@components/Spring';
import OfferCard from '@components/OfferCard';

// hooks
import useDraggableScrollContainer from '@hooks/useDraggableScrollContainer';

// assets
import img1 from '@assets/products/1.webp';
import img2 from '@assets/products/2.webp';
import img3 from '@assets/products/3.webp';
import img4 from '@assets/products/4.webp';
import img5 from '@assets/products/5.webp';
import img6 from '@assets/products/6.webp';

const data = [
    {
        id: 'product-1',
        name: 'Leather Flat Sandals',
        img: img1,
        category: 'shoes',
        price: 150,
        discount: 20,
    },
    {
        id: 'product-2',
        name: 'Gioia Super Push-up Bra',
        img: img2,
        category: 'lingerie',
        price: 250,
        discount: 35,
    },
    {
        id: 'product-3',
        name: 'Leather Cross Body Bag',
        img: img3,
        category: 'accessories',
        price: 123.99,
        discount: 35
    },
    {
        id: 'product-4',
        name: 'Hair clip with Pearls',
        img: img4,
        category: 'accessories',
        price: 299.90,
        discount: 10
    },
    {
        id: 'product-5',
        name: 'Non Wired Sports Bra',
        img: img5,
        category: 'sportswear',
        price: 350,
        discount: 40
    },
    {
        id: 'product-6',
        name: 'Watch with Leather Strap',
        img: img6,
        category: 'accessories',
        price: 150,
        discount: 20
    }
]

const LatestOffer = () => {
    const {containerRef, isDragging} = useDraggableScrollContainer();

    return (
        <Spring className="card flex flex-col h-full">
            <h2 className="flex-1 p-5 !pb-[15px] xs:p-6">
                Latest Offer Products
            </h2>
            <div className={`draggable-container flex gap-4 p-5 xs:p-6 !pt-0 ${isDragging ? 'isDragging' : ''}`}
                 ref={containerRef}>
                {
                    data.map((product, index) => (
                        <OfferCard key={product.id} product={product} index={index}/>
                    ))
                }
            </div>
        </Spring>
    )
}

export default LatestOffer