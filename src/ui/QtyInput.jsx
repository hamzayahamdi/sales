import {useState} from 'react';

const QtyInput = () => {
    const [value, setValue] = useState(1);

    return (
        <div className="btn--base h-9 min-w-[70px] rounded-[10px] text-label dark:text-white flex items-center justify-between px-3">
            <button className="text-[10px]"
                    disabled={value === 1}
                    aria-label="Decrease quantity"
                    onClick={() => setValue(value - 1)}>
                <i className="icon-minus-solid"/>
            </button>
            <span className="text-sm px-2 -mt-0.5">{value}</span>
            <button className="text-[10px]"
                    aria-label="Increase quantity"
                    onClick={() => setValue(value + 1)}>
                <i className="icon-plus-solid"/>
            </button>
        </div>
    )
}

export default QtyInput