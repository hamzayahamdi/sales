import { Link } from 'react-router-dom';

const PageNotFound = () => {
    return (
        <div className="min-h-screen bg-[#F3F3F8] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <h1 className="text-9xl font-bold text-[#599AED]">404</h1>
                <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page non trouvée</h2>
                <p className="mt-2 text-gray-600">
                    Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
                </p>
                <Link 
                    to="/dashboard" 
                    className="mt-6 inline-flex items-center justify-center px-4 py-2 bg-[#599AED] text-white rounded-lg hover:bg-[#4080d4] transition-colors"
                >
                    Retour au tableau de bord
                </Link>
            </div>
        </div>
    );
};

export default PageNotFound;