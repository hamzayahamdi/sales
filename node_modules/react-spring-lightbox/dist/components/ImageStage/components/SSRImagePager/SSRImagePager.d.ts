import type { ImagesList } from '../../../../types/ImagesList';
import * as React from 'react';
type ISSRImagePagerProps = {
    currentIndex: number;
    images: ImagesList;
};
declare const SSRImagePager: ({ currentIndex, images }: ISSRImagePagerProps) => React.JSX.Element;
export default SSRImagePager;
