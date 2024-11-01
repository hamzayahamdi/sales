// components
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Spring from '@components/Spring';
import IconButton from '@ui/IconButton';
import RangeSlider from '@ui/RangeSlider';
import {UnstyledAccordion, UnstyledAccordionDetails, UnstyledAccordionSummary} from '@ui/UnstyledAccordion';
import BasicCheckbox from '@ui/BasicCheckbox';
import Tag from '@ui/Tag';
import {Fragment} from 'react';
import ScrollContainer from '@components/ScrollContainer';

// hooks
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {useWindowSize} from 'react-use';
import useMeasure from 'react-use-measure';

// constants
import {PRODUCT_CATEGORIES, PRODUCT_COLORS, BRANDS} from '@constants/options';

// utils
import {faker} from '@faker-js/faker';
import classNames from 'classnames';

const FilterItem = ({value, label, checked, onChange}) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2.5 items-center">
                <BasicCheckbox id={value}
                               checked={checked}
                               onChange={onChange}
                               labelClass="dark:border-[var(--label-light)]"/>
                <label className="font-semibold text-[15px] text-header" htmlFor={value}>
                    {label}
                </label>
            </div>
            <span className="text-xs text-label font-medium">
                {faker.number.int({min: 10, max: 5000})}
            </span>
        </div>
    )
}

const FilterMenu = ({open, onOpen, onClose}) => {
    const {width} = useWindowSize();
    const [headerRef, {height}] = useMeasure();
    const [tags, setTags] = useState([]);
    const [price, setPrice] = useState([0, 500]);
    const [step, setStep] = useState(4);

    const {register, handleSubmit, formState: {errors}} = useForm({
        defaultValues: {
            minPrice: price[0],
            maxPrice: price[1]
        }
    });

    const handleAddTag = tag => {
        if (tags.includes(tag)) {
            setTags(tags.filter(t => t !== tag));
        } else {
            setTags([...tags, tag]);
        }
    }

    const onSubmit = data => {
        setPrice([data.minPrice, data.maxPrice]);
    }

    const Wrapper = width < 1280 ? SwipeableDrawer : Spring;
    const wrapperProps = width < 1280 ? {
        open,
        onOpen,
        onClose,
        sx: {
            '& .MuiDrawer-paper': {
                maxWidth: '360px',
                background: 'var(--widget)',
            }
        }
    } : {
        className: 'card h-full max-h-[var(--products-display-height)]',
    };

    const Content = width < 1280 ? Fragment : ScrollContainer;
    const contentProps = width < 1280 ? {} : {heightDeps: height};

    return (
        <Wrapper {...wrapperProps}>
            <div className="h-full">
                <div className="p-6 pb-[28px]" ref={headerRef}>
                    <div className="flex items-center justify-between">
                        <h2>Filters</h2>
                        <IconButton iconClass="icon-xmark-regular" className="4xl:hidden" onClick={onClose}/>
                    </div>
                    {
                        tags.length > 0 &&
                        <div className="flex flex-wrap gap-2 mt-4">
                            {
                                tags.map(tag => (
                                    <Tag key={tag}
                                         value={tag}
                                         onClick={() => setTags(tags.filter(t => t !== tag))}/>
                                ))
                            }
                            <Tag value="Clear all" onClick={() => setTags([])} role="reset"/>
                        </div>
                    }
                </div>
                <Content {...contentProps}>
                    <div className="track flex flex-col gap-8 p-6 pt-0">
                        <UnstyledAccordion defaultExpanded>
                            <UnstyledAccordionSummary>
                                <h3>Category</h3>
                                <button className="text-[18px] text-label" aria-label="Toggle">
                                    <i className="icon-chevron-down-regular"/>
                                </button>
                            </UnstyledAccordionSummary>
                            <UnstyledAccordionDetails>
                                <div className="flex flex-col gap-4 mt-4">
                                    {
                                        PRODUCT_CATEGORIES.map(category => (
                                            <FilterItem key={category.value}
                                                        label={category.label}
                                                        value={category.value}
                                                        checked={tags.includes(category.label)}
                                                        onChange={() => handleAddTag(category.label)}
                                            />
                                        ))
                                    }
                                </div>
                            </UnstyledAccordionDetails>
                        </UnstyledAccordion>
                        <UnstyledAccordion defaultExpanded>
                            <UnstyledAccordionSummary>
                                <h3>Price</h3>
                                <button className="text-[18px] text-label" aria-label="Toggle">
                                    <i className="icon-chevron-down-regular"/>
                                </button>
                            </UnstyledAccordionSummary>
                            <UnstyledAccordionDetails>
                                <div className="flex flex-col gap-6 mt-2">
                                    <RangeSlider value={price}
                                                 onChange={setPrice}
                                                 min={0}
                                                 max={1000}
                                                 step={1}/>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div
                                            className="grid grid-cols-[minmax(0,_1fr)_38px_minmax(0,_1fr)] items-center gap-[26px]">
                                            <input className={classNames('btn--base h-10 rounded-[10px] px-[15px]', {'border-red': errors.minPrice})}
                                                   defaultValue={price[0]}
                                                   onChange={e => setPrice([e.target.value, price[1]])}
                                                   type="number"
                                                   {...register('minPrice', {
                                                       required: true,
                                                       validate: value => value <= price[1]
                                                   })}
                                            />
                                            <span
                                                className="w-[38px] shrink-0 h-[1px] bg-border dark:bg-[var(--label-light)]"/>
                                            <input className={classNames('btn--base h-10 rounded-[10px] px-[15px]', {'border-red': errors.maxPrice})}
                                                   defaultValue={price[1]}
                                                   onChange={e => setPrice([price[0], e.target.value])}
                                                   type="number"
                                                   {...register('maxPrice', {
                                                       required: true,
                                                       validate: value => value >= price[0]
                                                   })}
                                            />
                                        </div>
                                        <button className="btn btn--primary w-full mt-6" type="submit">
                                            Apply
                                        </button>
                                    </form>
                                </div>
                            </UnstyledAccordionDetails>
                        </UnstyledAccordion>
                        <UnstyledAccordion defaultExpanded>
                            <UnstyledAccordionSummary>
                                <h3>Brand</h3>
                                <button className="text-[18px] text-label" aria-label="Toggle">
                                    <i className="icon-chevron-down-regular"/>
                                </button>
                            </UnstyledAccordionSummary>
                            <UnstyledAccordionDetails>
                                <div className="flex flex-col gap-4 mt-4">
                                    {
                                        BRANDS.slice(0, step).map(brand => (
                                            <FilterItem key={brand.value}
                                                        label={brand.label}
                                                        value={brand.value}
                                                        checked={tags.includes(brand.value)}
                                                        onChange={() => handleAddTag(brand.value)}
                                            />
                                        ))
                                    }
                                    {
                                        BRANDS.length > step &&
                                        <button className="btn--underline w-fit"
                                                onClick={() => setStep(BRANDS.length)}>
                                            Show all
                                        </button>
                                    }
                                </div>
                            </UnstyledAccordionDetails>
                        </UnstyledAccordion>
                        <UnstyledAccordion defaultExpanded>
                            <UnstyledAccordionSummary>
                                <h3>Color</h3>
                                <button className="text-[18px] text-label" aria-label="Toggle">
                                    <i className="icon-chevron-down-regular"/>
                                </button>
                            </UnstyledAccordionSummary>
                            <UnstyledAccordionDetails>
                                <div className="flex flex-col gap-4 mt-4">
                                    {
                                        PRODUCT_COLORS.map(color => (
                                            <FilterItem key={color.value}
                                                        label={color.label}
                                                        value={color.value}
                                                        checked={tags.includes(color.value)}
                                                        onChange={() => handleAddTag(color.value)}
                                            />
                                        ))
                                    }
                                </div>
                            </UnstyledAccordionDetails>
                        </UnstyledAccordion>
                    </div>
                </Content>
            </div>
        </Wrapper>
    )
}

export default FilterMenu