import { useState, useEffect, useRef } from 'react';

const useTableScroll = () => {
    const [isScrollable, setIsScrollable] = useState(false);
    const tableRef = useRef(null);

    useEffect(() => {
        const element = tableRef.current;
        if (!element) return;

        const handleTouchStart = () => {
            setIsScrollable(true);
        };

        const handleTouchEnd = () => {
            setIsScrollable(false);
        };

        const handleWheel = (e) => {
            if (!isScrollable) {
                e.stopPropagation();
                window.scrollBy(0, e.deltaY);
            }
        };

        element.addEventListener('touchstart', handleTouchStart);
        element.addEventListener('touchend', handleTouchEnd);
        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            element.removeEventListener('touchstart', handleTouchStart);
            element.removeEventListener('touchend', handleTouchEnd);
            element.removeEventListener('wheel', handleWheel);
        };
    }, [isScrollable]);

    return {
        ref: tableRef,
        isScrollable
    };
};

export default useTableScroll; 