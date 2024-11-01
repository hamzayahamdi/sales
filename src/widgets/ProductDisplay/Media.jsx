// styles
import 'swiper/css';
import 'swiper/css/effect-fade';

// components
import {Swiper, SwiperSlide} from 'swiper/react';
import {EffectFade, Thumbs, Autoplay} from 'swiper';

// hooks
import {useState} from 'react';

// assets
import img1 from '@assets/product/1.webp';
import img2 from '@assets/product/2.webp';
import img3 from '@assets/product/3.webp';
import img4 from '@assets/product/4.webp';

const placeholder = [
    {src: img1, alt: 'Product image 1'},
    {src: img2, alt: 'Product image 2'},
    {src: img3, alt: 'Product image 3'},
    {src: img4, alt: 'Product image 4'}
];

const Media = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <Swiper className="rounded-2xl w-full aspect-[465/455]"
                    thumbs={{swiper: thumbsSwiper}}
                    modules={[Autoplay, EffectFade, Thumbs]}
                    autoplay={{delay: 3000, disableOnInteraction: false}}
                    speed={1200}
                    effect="fade"
                    fadeEffect={{crossFade: true}}
                    loop
                    spaceBetween={0}
                    slidesPerView={1}>
                {
                    placeholder.map((item, index) => (
                        <SwiperSlide key={index}>
                            <img className="h-full" src={item.src} alt={item.alt}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
            <Swiper className="h-[70px] w-full xs:h-[110px] md:h-[142px]"
                    onSwiper={swiper => setThumbsSwiper(swiper)}
                    spaceBetween={16}
                    slidesPerView={3}
                    speed={1200}
                    breakpoints={{
                        768: {
                            spaceBetween: 24,
                        }
                    }}
                    loop
                    watchSlidesProgress>
                {
                    placeholder.map((item, index) => (
                        <SwiperSlide className="rounded-2xl overflow-hidden w-full h-full" key={index}>
                            <img className="h-full" src={item.src} alt={item.alt}/>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default Media