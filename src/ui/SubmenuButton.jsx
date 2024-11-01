const SubmenuButton = ({text = 'Bulk Actions', onClick, className}) => {
    return (
        <button className={`btn btn--base h-[50px] px-5 gap-2 ${className || ''}`}
                onClick={onClick}>
            <i className="icon-ellipsis-vertical-regular"/> {text}
        </button>
    )
}

export default SubmenuButton