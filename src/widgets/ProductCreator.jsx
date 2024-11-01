// components
import Spring from '@components/Spring';
import {toast} from 'react-toastify';
import Select from '@ui/Select';
import Tag from '@ui/Tag';
import DropFiles from '@components/DropFiles';
import DatePicker from '@components/DatePicker';

// hooks
import {useForm, Controller} from 'react-hook-form';
import useDraggableScrollContainer from '@hooks/useDraggableScrollContainer';
import useTags from '@hooks/useTags';
import {useState} from 'react';

// constants
import {PRODUCT_CATEGORIES, PUBLISH_STATUSES, VISIBILITY_STATUSES} from '@constants/options';

// utils
import classNames from 'classnames';
import dayjs from 'dayjs';

const ProductCreator = () => {
    const {register, setValue, handleSubmit, control, formState: {errors}} = useForm({
        defaultValues: {
            name: '',
            description: '',
            category: null,
            tags: [],
            shortDescription: '',
            publishStatus: PUBLISH_STATUSES[0],
            visibilityStatus: VISIBILITY_STATUSES[0],
            schedule: [],
            manufacturer: '',
            brand: '',
            stock: '',
            price: '',
            discount: '',
            orders: ''
        }
    });

    const {containerRef: galleryContainerRef, isDragging: galleryIsDragging} = useDraggableScrollContainer();
    const {containerRef: tagsContainerRef, isDragging: tagsIsDragging} = useDraggableScrollContainer();
    const {tags, inputRef, handleAddTag, handleDeleteTag} = useTags();

    const today = dayjs().add(1, 'minute');
    const [time, setTime] = useState(today);

    const checkKeydown = e => {
        if (e.key === 'Enter') {
            e.preventDefault();
        }
    }

    const handleTagInput = e => {
        handleAddTag(e);
        setValue('tags', tags);
    }

    const onSubmit = data => {
        console.log(data);
        toast.success('Product created successfully!');
    }

    return (
        <Spring className="layout-wrapper h-full">
            <form className="h-full grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-2"
                  onSubmit={handleSubmit(onSubmit)}
                  onKeyDown={checkKeydown}>
                <div className="card p-5 flex flex-col gap-4 xs:p-6 md:gap-6">
                    <div className="flex flex-col gap-3 md:gap-4">
                        <h2>Description</h2>
                        <div
                            className="card-container card-container--light p-4 rounded-2xl flex flex-col gap-3 md:gap-5">
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="name">
                                    Product Name
                                </label>
                                <input className={classNames('field-input', {'field-input--error': errors.name})}
                                       id="name"
                                       placeholder="Enter Product Name"
                                       {...register('name', {required: true})} />
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="description">
                                    Product Description
                                </label>
                                <textarea className="field-input !h-[78px] !py-4"
                                          id="description"
                                          placeholder="Enter Product Description"
                                          {...register('description')} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 md:gap-4">
                        <h2>Product Categories</h2>
                        <div
                            className="card-container card-container--light p-4 rounded-2xl flex flex-col gap-3 md:gap-5">
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="category">
                                    Product Category
                                </label>
                                <Controller name="category"
                                            control={control}
                                            rules={{required: true}}
                                            render={({field}) => (
                                                <Select
                                                    className={classNames('field-input', {'field-input--error': errors.category})}
                                                    id="category"
                                                    placeholder="Select Category"
                                                    options={PRODUCT_CATEGORIES}
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    innerRef={field.ref}
                                                    variant="basic"
                                                />
                                            )}/>
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="tags">
                                    Product Tags
                                </label>
                                <div className={classNames(
                                    'draggable-container field-input flex items-center gap-4',
                                    {
                                        'dragging': tagsIsDragging,
                                        '!px-2': tags.length
                                    })}
                                     ref={tagsContainerRef}>
                                    {
                                        tags && tags.map((tag, index) => (
                                            <Tag className="dark:!border-[var(--border)] dark:hover:!border-turquoise"
                                                 key={index}
                                                 value={tag}
                                                 onClick={() => handleDeleteTag(tag)}/>
                                        ))
                                    }
                                    <input className="flex-1 bg-transparent min-w-[300px]"
                                           id="tags"
                                           placeholder={tags.length ? '' : 'Enter Product Tags'}
                                           ref={inputRef}
                                           onKeyDown={handleTagInput}/>
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="shortDescription">
                                    Product Short Description
                                </label>
                                <textarea className="field-input !h-[88px] !py-4"
                                          id="shortDescription"
                                          placeholder="Enter Product Short Description"
                                          {...register('shortDescription')} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 md:gap-4">
                        <h2>Publish</h2>
                        <div
                            className="card-container card-container--light p-4 rounded-2xl flex flex-col gap-3 md:gap-5">
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="publishStatus">
                                        Status
                                    </label>
                                    <Controller name="publishStatus"
                                                control={control}
                                                rules={{required: true}}
                                                render={({field}) => (
                                                    <Select
                                                        className={classNames('field-input', {'field-input--error': errors.publishStatus})}
                                                        id="publishStatus"
                                                        placeholder="Select Status"
                                                        options={PUBLISH_STATUSES}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        innerRef={field.ref}
                                                        variant="basic"
                                                    />
                                                )}/>
                                </div>
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="visibilityStatus">
                                        Visibility
                                    </label>
                                    <Controller name="visibilityStatus"
                                                control={control}
                                                rules={{required: true}}
                                                render={({field}) => (
                                                    <Select
                                                        className={classNames('field-input', {'field-input--error': errors.visibilityStatus})}
                                                        id="visibilityStatus"
                                                        placeholder="Select Visibility"
                                                        options={VISIBILITY_STATUSES}
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        innerRef={field.ref}
                                                        variant="basic"
                                                    />
                                                )}/>
                                </div>
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="schedule">
                                    Publish Schedule
                                </label>
                                {/*<Controller name="schedule"*/}
                                {/*            control={control}*/}
                                {/*            render={({field}) => (*/}
                                {/*                <DatePicker value={field.value}*/}
                                {/*                            onChange={field.onChange}*/}
                                {/*                            id="schedule"*/}
                                {/*                />*/}
                                {/*            )}/>*/}
                                <DatePicker value={time}
                                            onChange={setTime}
                                            id="schedule"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card p-5 flex flex-col gap-4 xs:p-6 md:gap-6">
                    <div className="flex flex-col gap-3 md:gap-4">
                        <h2>General Info</h2>
                        <div
                            className="card-container card-container--light p-4 rounded-2xl flex flex-col gap-3 md:gap-5">
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="manufacturer">
                                    Manufacturer Name
                                </label>
                                <input
                                    className={classNames('field-input', {'field-input--error': errors.manufacturer})}
                                    id="manufacturer"
                                    placeholder="Enter Manufacturer Name"
                                    {...register('manufacturer', {required: true})} />
                            </div>
                            <div className="field-wrapper">
                                <label className="field-label" htmlFor="brand">
                                    Brand Name
                                </label>
                                <input className={classNames('field-input', {'field-input--error': errors.brand})}
                                       id="brand"
                                       placeholder="Enter Brand Name"
                                       {...register('brand', {required: true})} />
                            </div>
                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="stock">
                                        Stock
                                    </label>
                                    <input className={classNames('field-input', {'field-input--error': errors.stock})}
                                           id="stock"
                                           type="number"
                                           placeholder="Enter Stock"
                                           {...register('stock', {required: true})} />
                                </div>
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="price">
                                        Price, $
                                    </label>
                                    <input className={classNames('field-input', {'field-input--error': errors.price})}
                                           id="price"
                                           type="number"
                                           placeholder="Enter Price"
                                           {...register('price', {required: true})} />
                                </div>
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="discount">
                                        Discount, %
                                    </label>
                                    <input className="field-input"
                                           id="discount"
                                           type="number"
                                           placeholder="Enter Discount"
                                           {...register('discount')} />
                                </div>
                                <div className="field-wrapper">
                                    <label className="field-label" htmlFor="orders">
                                        Orders
                                    </label>
                                    <input className="field-input"
                                           id="orders"
                                           type="number"
                                           placeholder="Enter Orders"
                                           {...register('orders')} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 md:gap-4">
                        <h2>Product Gallery</h2>
                        <div className="card-container card-container--light rounded-2xl flex flex-col gap-3 md:gap-5">
                            <DropFiles
                                wrapperClass="card-container dark:border-border flex justify-center items-center h-[260px] border rounded-[14px] m-4 mb-0">
                                <div className="flex flex-col items-center gap-4 text-center">
                                    <i className="icon-cloud-arrow-up-light text-[40px] text-turquoise"/>
                                    <p className="font-medium text-[15px] text-header">
                                        Drop files here or click to upload
                                    </p>
                                </div>
                            </DropFiles>
                            <div
                                className={`draggable-container flex gap-4 p-4 pt-0 ${galleryIsDragging ? 'dragging' : ''}`}
                                ref={galleryContainerRef}>
                                {
                                    Array.from({length: 10}).map((_, index) => (
                                        <div className="h-20 w-20 border shrink-0 rounded-[10px]"
                                             style={{background: 'var(--input-bg)'}}
                                             key={index}/>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:gap-6 md:flex md:ml-auto">
                        <button className="btn btn--base md:w-[120px]" type="reset">
                            Cancel
                        </button>
                        <button className="btn btn--primary md:w-[120px]" type="submit">
                            Submit
                        </button>
                    </div>
                </div>
            </form>
        </Spring>
    )
}

export default ProductCreator