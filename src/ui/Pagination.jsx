import classNames from 'classnames';

const Pagination = ({pagination, btnClass}) => {
    const total = pagination.maxPage;

    return (
        <div className="flex flex-wrap gap-4">
            {
                [...Array(total)].map((_, i) => {
                    return (
                        <button
                            className={classNames(`btn-page ${btnClass || ''}`, {'active': i === pagination.currentPage})}
                            key={i}
                            onClick={() => pagination.goToPage(i)}
                            disabled={pagination.currentPage === i}
                            aria-label={`Page ${i + 1}`}>
                            {i + 1}
                        </button>
                    );
                })
            }
        </div>
    )
}

export default Pagination