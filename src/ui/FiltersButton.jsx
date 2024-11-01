const FiltersButton = ({onClick}) => {
    return (
        <button className="btn btn--base gap-2 h-9 px-5 text-label"
                onClick={onClick}>
            <i className="icon-filters-regular"/> Filters
        </button>
    )
}

export default FiltersButton