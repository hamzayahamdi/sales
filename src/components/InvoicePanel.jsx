// components
import Spring from '@components/Spring';
import Search from '@ui/Search';
import SubmenuButton from '@ui/SubmenuButton';

const InvoicePanel = () => {
    return (
        <Spring className="layout-wrapper !pb-0 flex flex-col gap-4 mb-6 md:mb-8 sm:flex-row md:gap-6">
            <Search wrapperClass="flex-1"
                    inputClass="dark:bg-widget"
                    placeholder="Search for invoice..."/>
            <SubmenuButton className="dark:bg-widget"
                           text="Manage Invoice"/>
            <button className="btn btn--primary">
                Add New
            </button>
        </Spring>
    )
}

export default InvoicePanel