// components
import Lightbox from 'react-spring-lightbox';

// hooks
import {useState, useEffect} from 'react';

// utils
import PropTypes from 'prop-types';

const Gallery = ({images}) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [open, setOpen] = useState(false);

    const gotoPrevious = () =>
        currentImageIndex > 0 && setCurrentImageIndex(currentImageIndex - 1);

    const gotoNext = () =>
        currentImageIndex + 1 < images.length &&
        setCurrentImageIndex(currentImageIndex + 1);

    const handleClick = index => {
        setCurrentImageIndex(index);
        setOpen(true);
    }

    useEffect(() => {
        window.addEventListener('resize', () => {
            setOpen(false);
        });

        return () => {
            window.removeEventListener('resize', () => {
                setOpen(false);
            });
        }
    }, []);

    return (
        <>
            <div className="grid grid-cols-3 gap-2">
                {
                    images.map((image, index) => (
                        <div className="w-10 h-10 rounded-lg overflow-hidden cursor-pointer"
                             onClick={() => handleClick(index)}
                             key={index}>
                            <img className="h-full" src={image.src} alt="gallery item"/>
                        </div>
                    ))
                }
            </div>
            <Lightbox isOpen={open}
                      onPrev={gotoPrevious}
                      onNext={gotoNext}
                      renderPrevButton={() => {
                          return (
                              <button className="lightbox-arrow lightbox-arrow--left"
                                      onClick={gotoPrevious}
                                      aria-label="Previous image"
                                      disabled={currentImageIndex === 0}>
                                  <i className="icon-chevron-left-regular"/>
                              </button>
                          )
                      }}
                      renderNextButton={() => {
                          return (
                              <button className="lightbox-arrow lightbox-arrow--right"
                                      onClick={gotoNext}
                                      aria-label="Next image"
                                      disabled={currentImageIndex + 1 === images.length}>
                                  <i className="icon-chevron-right-regular"/>
                              </button>
                          )
                      }}
                      pageTransitionConfig={{
                          from: {opacity: 0},
                          enter: {opacity: 1},
                          leave: {opacity: 0},
                          config: {
                              duration: 300,
                          }
                      }}
                      onClose={() => setOpen(false)}
                      currentIndex={currentImageIndex}
                      images={images}/>
        </>
    )
}

Gallery.propTypes = {
    images: PropTypes.array,
}

export default Gallery