// components
import Spring from '@components/Spring';
import Media from './Media';
import Main from './Main';

const ProductDisplay = () => {
    return (
       <div className="layout-wrapper">
           <Spring className="card flex-1 h-full p-5 grid grid-cols-1 gap-8 xs:p-6
                xl:grid-cols-[minmax(0,_400px)_minmax(0,_1fr)] 3xl:grid-cols-[minmax(0,_465px)_minmax(0,_1fr)]">
               <Media />
               <Main />
           </Spring>
       </div>
    )
}

export default ProductDisplay