const Loader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[#F3F3F8]">
            <svg 
                className="w-12 h-12 animate-spin" 
                viewBox="0 0 24 24"
                fill="none"
            >
                <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="#599AED"
                    strokeWidth="4"
                />
                <path 
                    className="opacity-75" 
                    fill="#599AED"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
};

export default Loader;